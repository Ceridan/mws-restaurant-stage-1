import { IndexedDbService } from './idb-service';
import { Restaurant } from '../models/restaurant';

export class RestaurantService {
  constructor() {
    const port = 1337;
    this.serverUrl = `http://localhost:${port}/restaurants/`;

    this.db = new IndexedDbService();
    this.restaurants = [];
  }

  //----------------------------------------------------------------
  // Public methods
  //----------------------------------------------------------------

  /**
   * Check restaurants in the IndexedDB otherwise fetch them from the server
   * @returns {Promise<Array<Restaurant>>} returns promise with all restaurants as JSON
   */
  getRestaurants() {
    if (this.restaurants.length > 0) {
      return Promise.resolve(this.restaurants);
    }

    return this.db.getRestaurants()
      .then(restaurants => {
        return Promise.resolve(restaurants);
      })
      .catch(() => {
        return this.fetchRestaurants();
      });
  }

  /**
   * Check restaurant by its id in the IndexedDB otherwise fetch from the server
   * @param {string} id restaurant id
   * @returns {Promise<Restaurant>} returns promise with restaurant
   */
  getRestaurantById(id) {
    return this.db.getRestaurantById(id)
      .then(restaurant => {
        return Promise.resolve(restaurant);
      })
      .catch(() => {
        return this.fetchRestaurants()
          .then(restaurants => Promise.resolve(restaurants.find(restaurant => restaurant.id == id)));
      });
  }

  /**
   * Get restaurants filtered by cuisisne type
   * @param {string} cuisine cuisine type
   * @param {string} neighborhood neighborhood
   * @returns {Promise<Array<Restaurant>>} returns filtered array
   */
  getRestaurantByCuisineAndNeighborhood(cuisine, neighborhood) {
    cuisine = cuisine || 'all';
    neighborhood = neighborhood || 'all';

    return this.getRestaurants()
      .then(restaurants => {
        let results = restaurants;

        if (cuisine !== 'all') {
          results = results.filter(r => r.cuisineType === cuisine);
        }

        if (neighborhood !== 'all') {
          results = results.filter(r => r.neighborhood === neighborhood);
        }

        return Promise.resolve(results);
      });
  }

  /**
   * Get all unique cuisines from restaurants to create filter
   * @returns {Promise<Array<string>>} array of unique cuisines
   */
  getCuisines() {
    return this.getRestaurants()
      .then(restaurants => {
        const cuisineSet = new Set(restaurants.map(r => r.cuisineType));
        return Promise.resolve([...cuisineSet]);
      });
  }

  /**
   * Get all unique neighborhoods from restaurants to create filter
   * @returns {Promise<Array<string>>} array of unique neighborhoods
   */
  getNeighborhoods() {
    return this.getRestaurants()
      .then(restaurants => {
        const neighborhoodSet = new Set(restaurants.map(r => r.neighborhood));
        return Promise.resolve([...neighborhoodSet]);
      });
  }

  /**
   * Get GoogleMaps marker using lat and lng
   * @param {Restaurant} restaurant
   * @param {object} map Google Map object
   */
  getGoogleMapMarkerForRestaurant(restaurant, map) {
    const marker = new google.maps.Marker({
      position: restaurant.latlng,
      title: restaurant.name,
      url: restaurant.getRestaurantRelativeUrl(),
      map: map,
      animation: google.maps.Animation.DROP
    });

    return marker;
  }

  //----------------------------------------------------------------
  // Private methods
  //----------------------------------------------------------------

  /**
   * Fetch restaurants from the server and save to IndexedDB.
   * This method should be private.
   * @returns {Promise<Array<Restaurant>>} returns promise with all restaurants as JSON
   */
  fetchRestaurants() {
    return fetch(this.serverUrl)
      .then(response => response.json())
      .then(restaurantJson => {
        this.restaurants = restaurantJson.map(restaurant => new Restaurant(restaurant));
        this.db.saveRestaurants(this.restaurants);
        return Promise.resolve(this.restaurants);
      })
      .catch(err => Promise.reject(`Fetch request to the remote server failed. Error: ${err}`));
  }
}
