class HtmlElementBuilder {
  static createPictureElement(restaurant, existingPicture, existingImage) {
    const imageUrl400 = DBHelper.imageUrlForRestaurant(restaurant, 400);
    const imageUrl800 = DBHelper.imageUrlForRestaurant(restaurant, 800);
    const imageUrl800Compressed = DBHelper.imageUrlForRestaurant(restaurant, 800, true);

    const picture = existingPicture || document.createElement('picture');

    // const source400 = document.createElement('source');
    // source400.media = '(max-width: 400px)';
    // source400.srcset = `${imageUrl400} 1x, ${imageUrl800Compressed} 2x`;
    // picture.append(source400);

    // const source800 = document.createElement('source');
    // source800.media = '(max-width: 800px)';
    // source800.srcset = `${imageUrl800Compressed} 1x, ${imageUrl800} 2x`;
    // picture.append(source800);

    const source400 = document.createElement('source');
    source400.media = '(max-width: 460px)';
    source400.sizes = '90vw';
    source400.srcset = `${imageUrl400} 400w, ${imageUrl800Compressed} 800w`;
    picture.append(source400);

    const image = existingImage || document.createElement('img');
    image.src = imageUrl800;
    image.sizes = '25vw';
    image.srcset = `${imageUrl400} 400w, ${imageUrl800Compressed} 800w, ${imageUrl800} 1600w`;
    image.className = 'restaurant-img';
    image.alt = '';
    picture.append(image);

    return picture;
  }
}
