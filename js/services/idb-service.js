import { default as idb } from '../vendor/idb';
import { Restaurant } from '../models/restaurant';
import { Review } from '../models/review';

/**
 * Wrapper for idb (IndexedDB with promises)
 */
export class IndexedDbService {
  constructor() {
    this.db = idb.open('restaurant-db', 3, upgradeDb => {
      upgradeDb.createObjectStore('restaurants', { keyPath: 'id' });

      const reviewsStore = upgradeDb.createObjectStore('reviews', { keyPath: 'guid' });
      reviewsStore.createIndex('id', 'id');
      reviewsStore.createIndex('restaurant', 'restaurantId');
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
    return this.db.then(db => {
      const transaction = db.transaction('restaurants', 'readwrite');
      const store = transaction.objectStore('restaurants');

      var dbPromises = [];

      restaurants.forEach(restaurant => {
        dbPromises.push(store.put(restaurant));
      });

      return Promise.all(dbPromises);
    });
  }

  /**
   * Get restaurants which waiting for sync (has isSynced = false)
   * @returns {Promise<Array<Restaurant>>} list of reviews with id = 0
   */
  getSyncRestaurants() {
    return this.db.then(db => {
      const store = db.transaction('restaurants').objectStore('restaurants');
      return store.getAll();
    }).then(restaurants => {
      if (!restaurants) return Promise.resolve([]);

      const syncRestaurants = restaurants.filter(restaurant => !restaurant.isSynced);
      return Promise.resolve(syncRestaurants || []);
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
   * @returns {Promise<Array>}
   */
  saveReviews(reviews) {
    return this.db.then(db => {
      const transaction = db.transaction('reviews', 'readwrite');
      const store = transaction.objectStore('reviews');

      var dbPromises = [];

      reviews.forEach(review => {
        dbPromises.push(store.put(review));
      });

      return Promise.all(dbPromises);
    });
  }

  /**
   * Get reviews which waiting for sync (has id = 0)
   * @returns {Promise<Array<Review>>} list of reviews with id = 0
   */
  getSyncReviews() {
    return this.db.then(db => {
      const store = db.transaction('reviews').objectStore('reviews');
      const index = store.index('id');
      return index.getAll(0);
    }).then(reviews => {
      return Promise.resolve(reviews || []);
    });
  }
}
