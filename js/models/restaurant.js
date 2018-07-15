import { LatLng } from './latlng';
import { Review } from './review';
import { OperatingHours } from './operating-hours';

/**
 * Review class describes a single restaurant entity
 */
export class Restaurant {
  constructor(obj) {
    this.id = obj.id;
    this.name = obj.name;
    this.neighborhood = obj.neighborhood;
    this.photograph = obj.photograph;
    this.address = obj.address;
    this.latlng = new LatLng(obj.latlng);
    this.cuisineType = obj.cuisine_type || obj.cuisineType;
    this.operatingHours = new OperatingHours(obj.operating_hours || obj.operatingHours);
    this.createdAt = obj.createdAt;
    this.updatedAt = obj.updatedAt;
    this.isFavorite = obj.is_favorite || obj.isFavorite || false;
    this.isSynced = true;
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
