import { Restaurant } from '../models/restaurant';
import { LatLng } from '../models/latlng';

export class GoogleMapService {
  constructor() {
    this.markers = [];
  }

  /**
   * Initialize google map on the page
   * @param {HTMLElement} mapElement element contains google.maps.map object
   * @param {LatLng} initialLocation initial map location
   * @param {number} zoom Google Maps zoom value
   */
  initMap(mapElement, initialLocation, zoom = 12) {
    this.map = new google.maps.Map(mapElement, {
      zoom: zoom,
      center: initialLocation,
      scrollwheel: false
    });
  }

  /**
   * Get GoogleMaps marker using lat and lng
   * @param {Restaurant} restaurant Restaurant object
   * @return {any} google.maps.Marker object
   */
  getGoogleMapMarkerForRestaurant(restaurant) {
    if (!this.map) return;

    const marker = new google.maps.Marker({
      position: restaurant.latlng,
      title: restaurant.name,
      url: restaurant.getRestaurantRelativeUrl(),
      map: this.map,
      animation: google.maps.Animation.DROP
    });

    return marker;
  }

  /**
   * Add markers for current restaurants to the Google map
   * @param {Array<Restaurant>} restaurants array of restaurants
   */
  addMarkersToMap(restaurants) {
    restaurants.forEach(restaurant => {
      const marker = this.getGoogleMapMarkerForRestaurant(restaurant);
      google.maps.event.addListener(marker, 'click', () => {
        window.location.href = marker.url;
      });

      this.markers.push(marker);
    });
  }

  /**
   * Reset markers
   */
  resetMarkers() {
    this.markers.forEach(marker => marker.setMap(null));
    this.markers = [];
  }
}
