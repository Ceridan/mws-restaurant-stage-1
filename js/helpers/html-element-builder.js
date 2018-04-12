import { Restaurant } from '../models/restaurant';
import { Review } from '../models/review';

/**
 * HtmlElementBuildal class is a kind of helper class allows to create DOM-elements on the fly
 */
export class HtmlElementBuilder {
  /**
   * @param {Restaurant} restaurant restaurant object
   * @param {HTMLElement} existingPicture picture tag if already exists in html markup
   * @param {HTMLElement} existingImage image tah inside picture tag if alreadt exists in html markup
   * @returns {HTMLElement} filled picture tag. If existingPicture parameter is passed and it is not empty, then fill and return it
   */
  static createPictureElement(restaurant, existingPicture, existingImage) {
    const imageUrl400 = restaurant.getPathToPhoto(400);
    const imageUrl800 = restaurant.getPathToPhoto(800);
    const imageUrl800Compressed = restaurant.getPathToPhoto(800, true);

    const picture = existingPicture || document.createElement('picture');

    // First source considered to be used with small screens with singl column layouts
    const source400 = document.createElement('source');
    source400.media = '(max-width: 460px)';
    source400.sizes = '90vw';
    source400.srcset = `${imageUrl400} 400w, ${imageUrl800Compressed} 800w`;
    picture.append(source400);

    // In other cases our images will fill only 25% of the screen width
    const image = existingImage || document.createElement('img');
    image.src = imageUrl800;
    image.sizes = '25vw';
    image.srcset = `${imageUrl400} 400w, ${imageUrl800Compressed} 800w, ${imageUrl800} 1600w`;
    image.className = 'restaurant-img';
    // Set alt attribute for accesibility purpose. The photo os not very descriptive, so I will provide restaurant name and cuisine for the screen readers.
    image.alt = `${restaurant.name} restaurant. Cuisine type is ${restaurant.cuisineType}`;
    picture.append(image);

    return picture;
  }

  /**
   * Create restaurant list item element
   * @param {Restaurant} restaurant restaurant object
   * @returns {HTMLElement} list item element filled with restaurant info
   */
  static createRestaurantListItemElement(restaurant) {
    const li = document.createElement('li');

    // For images create picture tags using HtmlElementBuilder.
    // Picture tag allows to provide different options for browser
    // and it can choose the appropriate image to download
    const picture = HtmlElementBuilder.createPictureElement(restaurant);
    li.append(picture);

    const div = document.createElement('div');

    const name = document.createElement('h2');
    name.innerHTML = restaurant.name;
    div.append(name);

    // Create address element instead of div for correct semantics
    const address = document.createElement('address');

    const neighborhood = document.createElement('p');
    neighborhood.innerHTML = restaurant.neighborhood;
    address.append(neighborhood);

    const addressDetails = document.createElement('p');
    addressDetails.innerHTML = restaurant.address;
    address.append(addressDetails);

    div.append(address);

    const more = document.createElement('a');
    more.innerHTML = 'View Details';
    more.href = restaurant.getRestaurantRelativeUrl();

    // Add aria-label to give more information to screen readers,
    // because 'View Details' says little about real purpose of the link
    more.setAttribute('aria-label', `${restaurant.name} restaurant details`);
    div.append(more);

    li.append(div);

    return li;
  }

  /**
   * Create review list item element
   * @param {Review} review review object
   * @returns {HTMLElement} list item element filled with review info
   */
  static createReviewListItemElement(review) {
    const li = document.createElement('li');

    const divReviewHeader = document.createElement('div');
    divReviewHeader.className = 'review-header';

    const name = document.createElement('p');
    name.innerHTML = review.name;
    name.className = 'review-name';
    divReviewHeader.appendChild(name);

    const date = document.createElement('p');
    date.innerHTML = review.date;
    date.className = 'review-date';
    divReviewHeader.appendChild(date);

    li.appendChild(divReviewHeader);

    // Create article element instead of div for correct semantics
    const articleReviewContent = document.createElement('article');
    articleReviewContent.className = 'review-content';

    // Here is some maybe not very fair trick. I want to show review rating using star symbols.
    // So, if it has rating of 4 it could be shown as ★★★★. It looks nice, but it is bad
    // from the accessibility point of view, because screen reader couldn't read it correctly.
    // So trick is to give an image role to paragraph element and set aria-label attribute
    // for it which will contain rating number as is.
    const rating = document.createElement('p');
    rating.innerHTML = `Rating: ${'★'.repeat(review.rating)}`;
    rating.className = 'review-rating';
    rating.setAttribute('role', 'img');
    rating.setAttribute('aria-label', `Rating: ${review.rating}`);
    articleReviewContent.appendChild(rating);

    const comments = document.createElement('p');
    comments.innerHTML = review.comments;
    comments.className = 'review-comment';
    articleReviewContent.appendChild(comments);

    li.appendChild(articleReviewContent);

    return li;
  }
}
