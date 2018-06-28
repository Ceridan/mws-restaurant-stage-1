import { IndexedDbService } from './idb-service';
import { Restaurant } from '../models/restaurant';
import { Review } from '../models/review';

export class RestaurantService {
  constructor() {
    const port = 1337;
    this.serverUrl = `http://localhost:${port}`;

    this.db = new IndexedDbService();
  }

  //----------------------------------------------------------------
  // Public methods
  //----------------------------------------------------------------

  /**
   * Check restaurants in the IndexedDB otherwise fetch them from the server
   * @returns {Promise<Array<Restaurant>>} returns promise with all restaurants as JSON
   */
  getRestaurants() {
    return this.db.getRestaurants()
      .then(restaurants => {
        restaurants.sort((r1, r2) => r2.isFavorite - r1.isFavorite || r1.id - r2.id);
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
   * Save changes in the restaurant to the idb
   * @param {*} restaurant - restaurant object
   */
  saveRestaurant(restaurant) {
    this.db.saveRestaurants([restaurant]);
    this.updateRestaurantFavorite(restaurant);
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
   * Get all reviews for restaurant
   * @param {string} restaurnatId  - restaurant id
   */
  getReviewsByRestaurantId(restaurnatId) {
    return this.db.getReviewsByRestaurantId(restaurnatId)
      .then(reviews => {
        return Promise.resolve(reviews);
      })
      .catch(() => {
        return this.fetchReviewsByRestaurantId(restaurnatId);
      });
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
    const restaurantsEndpoint = `${this.serverUrl}/restaurants`;

    return fetch(restaurantsEndpoint)
      .then(response => response.json())
      .then(restaurantJson => {
        const restaurants = restaurantJson.map(restaurant => new Restaurant(restaurant));
        restaurants.sort((r1, r2) => r2.isFavorite - r1.isFavorite || r1.id - r2.id);

        this.db.saveRestaurants(restaurants);
        return Promise.resolve(restaurants);
      })
      .catch(err => Promise.reject(`Fetch request to the remote server failed. Error: ${err}`));
  }

  /**
   * Fetch review for restaurant from the server and save to IndexedDB
   * @param {string} restaurantId - restaurant id
   */
  fetchReviewsByRestaurantId(restaurantId) {
    const reviewsEndpoint = `${this.serverUrl}/reviews/?restaurant_id=${restaurantId}`;

    return fetch(reviewsEndpoint)
      .then(response => response.json())
      .then(reviewJson => {
        const reviews = reviewJson.map(review => new Review(review));

        this.db.saveReviews(reviews);
        return Promise.resolve(reviews);
      })
      .catch(err => Promise.reject(`Fetch request to the remote server failed. Error: ${err}`));
  }

  /**
   * Create PUT request to the server to set restaurant as favorite
   * @param {*} restaurant - restaurant object
   */
  updateRestaurantFavorite(restaurant) {
    const favoriteEndpoint = `${this.serverUrl}/restaurants/${restaurant.id}/?is_favorite=${restaurant.isFavorite}`;

    return fetch(favoriteEndpoint, {
      method: 'PUT'
    })
      .catch(err => console.log(err));
  }
}
