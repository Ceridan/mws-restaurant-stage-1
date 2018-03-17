/**
 * HtmlElementBuildal class is a kind of helper class allows to create DOM-elements on the fly
 */
class HtmlElementBuilder {
  /**
   * @param {any} restaurant - object contains information about restaurant
   * @param {HTMLElement} existingPicture - picture tag if already exists in html markup
   * @param {HTMLElement} existingImage - image tah inside picture tag if alreadt exists in html markup
   * @returns {HTMLElement} - filled picture tag. If existingPicture parameter is passed and it is not empty, then fill and return it
   */
  static createPictureElement(restaurant, existingPicture, existingImage) {
    const imageUrl400 = DBHelper.imageUrlForRestaurant(restaurant, 400);
    const imageUrl800 = DBHelper.imageUrlForRestaurant(restaurant, 800);
    const imageUrl800Compressed = DBHelper.imageUrlForRestaurant(restaurant, 800, true);

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
    // Set alt attribute for accesibility purpose. Here I set alt="" to hide images from the screen readers
    // because the images is not very informative and I decide to tottaly hide it.
    image.alt = '';
    picture.append(image);

    return picture;
  }
}
