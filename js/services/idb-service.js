import { default as idb } from '../vendor/idb';
import { Restaurant } from '../models/restaurant';

/**
 * Wrapper for idb (IndexedDB with promises)
 */
export class IndexedDbService {
  constructor() {
    this.db = idb.open('restaurant-db', 2, upgradeDb => {
      upgradeDb.createObjectStore('restaurants', { keyPath: 'id' });

      upgradeDb.createObjectStore('reviews', { keyPath: 'id' })
        .createIndex('restaurant', 'restaurantId');
    });
  }

  /**
   * @returns {Promise<Array<Restaurant>>} returns promise with all restaurants as JSON
   */
  getRestaurants() {
    return this.db.then(db => {
      const store = db.transaction('restaurants').objectStore('restaurants');
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
      const store = db.transaction('restaurants').objectStore('restaurants');
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
      const transaction = db.transaction('restaurants', 'readwrite');
      const store = transaction.objectStore('restaurants');

      restaurants.forEach(restaurant => {
        store.put(restaurant);
      });
    });
  }

  /**
   * @param {string} restaurantId - restaurant id
   * @returns {Promise<Array<Review>>} - array with stored reviews for restaurant
   */
  getReviewsByRestaurantId(restaurantId) {
    return this.db.then(db => {
      const store = db.transaction('reviews').objectStore('reviews');
      const index = store.index('restaurant');
      return index.getAll(parseInt(restaurantId));
    }).then(reviews => {
      if (reviews && reviews.length > 0)
        return Promise.resolve(reviews.map(review => new Review(review)));
      else
        return Promise.reject(`Reviews for restaurant with id = ${id} not found in indexedDB`);
    });
  }

  /**
   * @param {Array<Review>} reviews array of reviews to save in IndexedDB
   */
  saveReviews(reviews) {
    this.db.then(db => {
      const transaction = db.transaction('reviews', 'readwrite');
      const store = transaction.objectStore('reviews');

      reviews.forEach(review => {
        store.put(review);
      });
    });
  }
}
