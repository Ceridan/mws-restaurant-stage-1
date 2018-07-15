import { Restaurant } from '../models/restaurant';
import { Review } from '../models/review';
import { OperatingHours } from '../models/operating-hours';
import { RestaurantService } from '../services/restaurant-service';
import { GoogleMapService } from '../services/google-map-service';
import { HtmlElementBuilder } from '../helpers/html-element-builder';

export class RestaurantPageHandler {
  constructor() {
    this.googleMapService = new GoogleMapService();
    this.restaurantService = new RestaurantService();
  }

  //----------------------------------------------------------------
  // Public methods
  //----------------------------------------------------------------

  /**
   * Fetch restaurant depends on URL and update page HTML
   */
  updateRestaurant() {
    this.fetchRestaurant()
      .then(restaurant => {
        this.restaurant = restaurant;
        this.fillRestaurantHtml(restaurant);
        this.fillBreadcrumb(restaurant);
        this.setupReviewDialog();

        this.fetchReviewByRestaurantId(restaurant.id)
          .then(reviews => {
            this.fillReviewsHtml(reviews);
          });
      })
      .catch(err => console.error(err));
  }

  /**
   * Create restaurant HTML and add it to the webpage
   * @param {Restaurant} restaurant restaurant object
   */
  fillRestaurantHtml(restaurant) {
    const name = document.getElementById('restaurant-name');
    name.innerHTML = restaurant.name;

    const address = document.getElementById('restaurant-address');
    address.innerHTML = restaurant.address;

    const picture = document.getElementById('restaurant-picture');
    const image = document.getElementById('restaurant-img');

    // For images we pass existing picture and image tag
    // to HtmlElementBuilder.createPictureElement to fill with specific sources
    // Picture tag allows to provide different options for browser
    // and it can choose the appropriate image to download
    HtmlElementBuilder.createPictureElement(restaurant, picture, image);

    // Fix the result of HtmlElementBuilder.createPictureElement
    // because in restaurant details page image can fill up to 50% of the screen
    // on big screen sizes
    image.sizes = '50vw';

    const cuisine = document.getElementById('restaurant-cuisine');
    cuisine.innerHTML = restaurant.cuisineType;

    const favorite = document.getElementById('restaurant-favorite');
    const favoriteLarge = favorite.querySelector('.large');

    if (restaurant.isFavorite) {
      favorite.classList.add('favorite');
      this.fillFavoriteButtonText(restaurant, favorite, favoriteLarge);
    }

    favorite.addEventListener('click', () => {
      favorite.classList.toggle('favorite');
      restaurant.isFavorite = !restaurant.isFavorite;
      this.fillFavoriteButtonText(restaurant, favorite, favoriteLarge);
      this.restaurantService.saveFavorite(restaurant);
    });

    // Fill operating hours
    if (restaurant.operatingHours) {
      this.fillRestaurantHoursHtml(restaurant.operatingHours);
    }
  }

  /**
   * Create restaurant operating hours HTML table and add it to the webpage
   * @param {OperatingHours} operatingHours object with operating hours for each day
   */
  fillRestaurantHoursHtml(operatingHours) {
    const hours = document.getElementById('restaurant-hours');

    for (let key in operatingHours) {
      const row = document.createElement('tr');

      const day = document.createElement('td');
      day.innerHTML = key;
      row.appendChild(day);

      const time = document.createElement('td');
      time.innerHTML = operatingHours[key];
      row.appendChild(time);

      hours.appendChild(row);
    }
  }

  /**
   * Create all reviews HTML and add them to the webpage
   * @param {Array<Review>} reviews array of review objects
   */
  fillReviewsHtml(reviews) {
    const container = document.getElementById('reviews-container');

    if (!reviews) {
      const noReviews = document.createElement('p');
      noReviews.innerHTML = 'No reviews yet!';
      container.appendChild(noReviews);
      return;
    }

    const ul = document.getElementById('reviews-list');
    reviews.forEach(review => {
      ul.appendChild(HtmlElementBuilder.createReviewListItemElement(review));
    });
    container.appendChild(ul);

    this.restaurantService.requestBackgroundSync('review');
    this.restaurantService.requestBackgroundSync('favorite');
  }

  /**
   * Add restaurant name to the breadcrumb navigation menu
   * @param {Restaurant} restaurant restaurant object
   */
  fillBreadcrumb(restaurant) {
    const breadcrumb = document.getElementById('breadcrumb');
    const li = document.createElement('li');

    const link = document.createElement('a');
    link.href = `/restaurant.html?id=${restaurant.id}`;
    link.setAttribute('aria-current', 'page');
    link.innerHTML = restaurant.name;
    li.appendChild(link);

    breadcrumb.appendChild(li);
  }

  /**
   * Fill map element with google maps content
   */
  fillMapHtml() {
    const mapElement = document.getElementById('map');
    const zoom = 16;

    if (this.restaurant) {
      this.googleMapService.initMap(mapElement, this.restaurant.latlng, zoom);
      this.googleMapService.addMarkersToMap([this.restaurant]);
      return;
    }

    this.fetchRestaurant()
      .then(restaurant => {
        this.googleMapService.initMap(mapElement, restaurant.latlng, zoom);
        this.googleMapService.addMarkersToMap([restaurant]);
      })
      .catch(err => console.error(`Could not load the map cause of error: ${err}`));
  }

  /**
   * Add event listeners to work with review dialog
   */
  setupReviewDialog() {
    const dialog = document.getElementById('review-dialog');
    const openDialogButton = document.getElementsByClassName('button-review')[0];
    const saveDialogButton = document.getElementsByClassName('button-review-save')[0];
    const cancelDialogButton = document.getElementsByClassName('button-review-cancel')[0];

    const firstControl = document.getElementById('review-form-name');
    const lastControl = cancelDialogButton;

    dialog.addEventListener('keydown', trapTabKey);

    openDialogButton.addEventListener('click', e => {
      e.stopPropagation();
      this.clearDialogForm();
      dialog.showModal();
    });

    saveDialogButton.addEventListener('click', e => {
      e.stopPropagation();
      this.addNewReviewListItem();
      closeDialog();
    });

    cancelDialogButton.addEventListener('click', e => {
      e.stopPropagation();
      closeDialog();
    });

    function trapTabKey(e) {
      const KB_TAB = 9;
      const KB_ESCAPE = 27;

      if (e.keyCode === KB_TAB) {
        // SHIFT + TAB
        if (e.shiftKey) {
          if (document.activeElement === firstControl) {
            e.preventDefault();
            lastControl.focus();
          }

        // TAB
        } else {
          if (document.activeElement === lastControl) {
            e.preventDefault();
            firstControl.focus();
          }
        }
      }

      // ESCAPE
      if (e.keyCode === KB_ESCAPE) {
        closeDialog();
      }
    }

    function closeDialog() {
      dialog.removeEventListener('keydown', trapTabKey);
      dialog.close();
    }
  }

  //----------------------------------------------------------------
  // Private methods
  //----------------------------------------------------------------

  /**
   * Fetch restaurant depends on URL
   * @returns {Promise<Restaurant>} restaurant object as a promise
   */
  fetchRestaurant() {
    const url = new URL(window.location.href);
    const id = url.searchParams.get('id');

    if (!id) {
      return Promise.reject('Could not fetch restaurant by ID. The url does not contain ID parameter');
    }

    return this.restaurantService.getRestaurantById(id);
  }

  /**
   * Fetch reviews depends on URL
   * @returns {Promise<Array<Review>>} reviews array
   */
  fetchReviewByRestaurantId(restaurantId) {
    if (!restaurantId) {
      return Promise.resolve([]);
    }

    return this.restaurantService.getReviewsByRestaurantId(restaurantId);
  }

  /**
   * Set text and aria-label for Favorite button
   * @param {Restaurant} restaurant - resturant object
   * @param {HTMLElement} favorite - favorite button element
   * @param {HTMLElement} favoriteLarge - favorite button span element with class large
   */
  fillFavoriteButtonText(restaurant, favorite, favoriteLarge) {
    if (restaurant.isFavorite) {
      favoriteLarge.textContent = 'My favorite!';
      favorite.setAttribute('aria-label', 'My favorite!');
    } else {
      favoriteLarge.textContent = 'Mark as favorite';
      favorite.setAttribute('aria-label', 'Mark as favorite');
    }
  }

  /**
   * Clear review dialog form elements
   */
  clearDialogForm() {
    const nameElement = document.getElementById('review-form-name');
    const ratingElement = document.getElementById('review-form-rating');
    const commentElement = document.getElementById('review-form-comment');

    nameElement.value = '';
    ratingElement.selectedIndex = 4;
    commentElement.value = '';
  }

  /**
   * Get values from the write a review dialog form and create new review list item element
   */
  addNewReviewListItem() {
    const nameElement = document.getElementById('review-form-name');
    const ratingElement = document.getElementById('review-form-rating');
    const commentElement = document.getElementById('review-form-comment');

    const name = nameElement.value;
    const rating = ratingElement.options[ratingElement.selectedIndex].value;
    const comments = commentElement.value;

    const review = this.restaurantService.saveReview(this.restaurant.id, name, rating, comments);

    const li = HtmlElementBuilder.createReviewListItemElement(review);
    const ul = document.getElementById('reviews-list');
    ul.insertBefore(li, ul.firstChild);
  }
}
