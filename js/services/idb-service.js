import { default as idb } from '../vendor/idb';
import { Restaurant } from '../models/restaurant';

/**
 * Wrapper for idb (IndexedDB with promises)
 */
export class IndexedDbService {
  constructor() {
    this.db = idb.open('restaurant-db', 1, upgradeDb => {
      upgradeDb.createObjectStore('restaurant', { keyPath: 'id' });
    });
  }

  /**
   * @returns {Promise<Array<Restaurant>>} returns promise with all restaurants as JSON
   */
  getRestaurants() {
    return this.db.then(db => {
      const store = db.transaction('restaurant').objectStore('restaurant');
      return store.getAll();
    }).then(restaurants => {
      if (restaurants && restaurants.length > 0)
        return Promise.resolve(restaurants.map(restaurant => new Restaurant(restaurant)));
      else
        return Promise.reject('Restaurants not found in indexedDB');
    });
  }

  /**
   * @param {string} id restaurant id
   * @returns {Promise<Restaurant>} returns promise with restaurant as JSON
   */
  getRestaurantById(id) {
    return this.db.then(db => {
      const store = db.transaction('restaurant').objectStore('restaurant');
      return store.get(parseInt(id));
    }).then(restaurant => {
      if (restaurant)
        return Promise.resolve(new Restaurant(restaurant));
      else
        return Promise.reject(`Restaurant with id = ${id} not found in indexedDB`);
    });
  }

  /**
   * @param {Array<Restaurant>} restaurants array of restaurants to save in IndexedDB
   */
  saveRestaurants(restaurants) {
    this.db.then(db => {
      const transaction = db.transaction('restaurant', 'readwrite');
      const store = transaction.objectStore('restaurant');

      restaurants.forEach(restaurant => {
        store.put(restaurant);
      });
    });
  }
}
