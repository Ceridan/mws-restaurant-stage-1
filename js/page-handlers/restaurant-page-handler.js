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
    cuisine.innerHTML = restaurant.cuisine_type;

    // Fill operating hours
    if (restaurant.operatingHours) {
      this.fillRestaurantHoursHtml(restaurant.operatingHours);
    }

    // Fill reviews
    this.fillReviewsHtml(restaurant.reviews);
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
    const title = document.createElement('h3');
    title.innerHTML = 'Reviews';
    container.appendChild(title);

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
}
