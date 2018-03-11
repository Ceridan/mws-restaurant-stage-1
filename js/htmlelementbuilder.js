class HtmlElementBuilder {
  static createPictureElement(restaurant, existingPicture, existingImage) {
    const imageUrl400 = DBHelper.imageUrlForRestaurant(restaurant, 400);
    const imageUrl800 = DBHelper.imageUrlForRestaurant(restaurant, 800);

    const picture = existingPicture || document.createElement('picture');

    const source400 = document.createElement('source');
    source400.media = '(max-width: 400px)';
    source400.srcset = `${imageUrl400} 1x, ${imageUrl800} 2x`;
    picture.append(source400);

    const image = existingImage || document.createElement('img');
    image.src = imageUrl800;
    image.className = 'restaurant-img';
    picture.append(image);

    return picture;
  }
}
