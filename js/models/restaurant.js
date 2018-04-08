import { LatLng } from './latlng';
import { Review } from './review';
import { OperatingHours } from './operating-hours';

/**
 * Review class describes a single restaurant entity
 */
export class Restaurant {
  constructor({
    id,
    name,
    neighborhood,
    photograph,
    address,
    latlng,
    cuisine_type,
    operating_hours,
    reviews = [],
    createdAt,
    updatedAt
  }) {
    this.id = id;
    this.name = name;
    this.neighborhood = neighborhood;
    this.photograph = photograph;
    this.address = address;
    this.latlng = new LatLng(latlng);
    this.cuisineType = cuisine_type;
    this.operatingHours = new OperatingHours(operating_hours);
    this.reviews = reviews.map(review => new Review(review));
    this.createdAt = createdAt;
    this.updatedAt = updatedAt;
  }

  /**
   * Construct relative path to the images with photograph depends on parameters
   * @param {number} size image width
   * @param {bool} isCompressed is compression required
   * @return {string} relative path to image
   */
  getPathToPhoto(size = 800, isCompressed = false) {
    const compressedSuffix = isCompressed ? '-compressed' : '';
    return (`/img/${size}${compressedSuffix}/${this.photograph || this.id}.jpg`);
  }

  /**
   * Returns relative path to the restaurant details
   * @returns {string} relative path to restaurant detail page
   */
  getRestaurantRelativeUrl() {
    return `./restaurant.html?id=${this.id}`;
  }
}
