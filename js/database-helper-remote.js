/**
 * Common database helper functions.
 */
class DBHelper {

  /**
   * Returns server with REST API
   */
  static get SERVER_URL() {
    const port = 1337;
    return `http://localhost:${port}`;
  }

  static get IDB() {
    return idb.open('restaurant-db', 1, upgradeDb => {
      upgradeDb.createObjectStore('restaurant', { keyPath: 'id' });
    });
  }

  static getRestaurantsFromIdb() {
    return DBHelper.IDB.then(db => {
      const store = db.transaction('restaurant').objectStore('restaurant');
      return store.getAll();
    }).then(restaurants => {
      if (restaurants && restaurants.length > 0)
        return Promise.resolve(restaurants);
      else
        return Promise.reject();
    });
  }

  static getRestaurantFromIdbById(id) {
    return DBHelper.IDB.then(db => {
      const store = db.transaction('restaurant').objectStore('restaurant');
      return store.get(parseInt(id));
    }).then(restaurant => {
      if (restaurant)
        return Promise.resolve(restaurant);
      else
        return Promise.reject();
    });
  }

  static storeRestaurantsToIdb(restaurants) {
    DBHelper.IDB.then(db => {
      const transaction = db.transaction('restaurant', 'readwrite');
      const store = transaction.objectStore('restaurant');

      restaurants.forEach(restaurant => {
        store.put(restaurant);
      });

      return transaction.complete;
    });
  }

  /**
   * Fetch all restaurants.
   */
  static fetchRestaurants(callback) {
    const restaurantsUrl = `${DBHelper.SERVER_URL}/restaurants`;

    DBHelper.getRestaurantsFromIdb().then(restaurants => {
      callback(null, restaurants);
    }).catch(() => {
      fetch(restaurantsUrl)
        .then(response => response.json())
        .then(jsonData => {
          DBHelper.storeRestaurantsToIdb(jsonData);
          callback(null, jsonData);
        })
        .catch(err => {
          callback(`Request failed. Error: ${err}`, null);
        });
    });
  }

  /**
   * Fetch a restaurant by its ID.
   */
  static fetchRestaurantById(id, callback) {
    const restaurantUrl = `${DBHelper.SERVER_URL}/restaurants/${id}`;

    DBHelper.getRestaurantFromIdbById(id).then(restaurant => {
      callback(null, restaurant);
    }).catch(() => {
      fetch(restaurantUrl)
        .then(response => response.json())
        .then(jsonData => {
          callback(null, jsonData);
        })
        .catch(err => {
          callback(`Request failed. Error: ${err}`, null);
        });
    });
  }

  /**
   * Fetch restaurants by a cuisine type with proper error handling.
   */
  static fetchRestaurantByCuisine(cuisine, callback) {
    // Fetch all restaurants  with proper error handling
    DBHelper.fetchRestaurants((error, restaurants) => {
      if (error) {
        callback(error, null);
      } else {
        // Filter restaurants to have only given cuisine type
        const results = restaurants.filter(r => r.cuisine_type == cuisine);
        callback(null, results);
      }
    });
  }

  /**
   * Fetch restaurants by a neighborhood with proper error handling.
   */
  static fetchRestaurantByNeighborhood(neighborhood, callback) {
    // Fetch all restaurants
    DBHelper.fetchRestaurants((error, restaurants) => {
      if (error) {
        callback(error, null);
      } else {
        // Filter restaurants to have only given neighborhood
        const results = restaurants.filter(r => r.neighborhood == neighborhood);
        callback(null, results);
      }
    });
  }

  /**
   * Fetch restaurants by a cuisine and a neighborhood with proper error handling.
   */
  static fetchRestaurantByCuisineAndNeighborhood(cuisine, neighborhood, callback) {
    // Fetch all restaurants
    DBHelper.fetchRestaurants((error, restaurants) => {
      if (error) {
        callback(error, null);
      } else {
        let results = restaurants;
        if (cuisine != 'all') { // filter by cuisine
          results = results.filter(r => r.cuisine_type == cuisine);
        }
        if (neighborhood != 'all') { // filter by neighborhood
          results = results.filter(r => r.neighborhood == neighborhood);
        }
        callback(null, results);
      }
    });
  }

  /**
   * Fetch all neighborhoods with proper error handling.
   */
  static fetchNeighborhoods(callback) {
    // Fetch all restaurants
    DBHelper.fetchRestaurants((error, restaurants) => {
      if (error) {
        callback(error, null);
      } else {
        // Get all neighborhoods from all restaurants
        const neighborhoods = restaurants.map((v, i) => restaurants[i].neighborhood);
        // Remove duplicates from neighborhoods
        const uniqueNeighborhoods = neighborhoods.filter((v, i) => neighborhoods.indexOf(v) == i);
        callback(null, uniqueNeighborhoods);
      }
    });
  }

  /**
   * Fetch all cuisines with proper error handling.
   */
  static fetchCuisines(callback) {
    // Fetch all restaurants
    DBHelper.fetchRestaurants((error, restaurants) => {
      if (error) {
        callback(error, null);
      } else {
        // Get all cuisines from all restaurants
        const cuisines = restaurants.map((v, i) => restaurants[i].cuisine_type);
        // Remove duplicates from cuisines
        const uniqueCuisines = cuisines.filter((v, i) => cuisines.indexOf(v) == i);
        callback(null, uniqueCuisines);
      }
    });
  }

  /**
   * Restaurant page URL.
   */
  static urlForRestaurant(restaurant) {
    return (`./restaurant.html?id=${restaurant.id}`);
  }

  /**
   * Restaurant image URL.
   */
  static imageUrlForRestaurant(restaurant, size = 800, isCompressed = false) {
    const compressedSuffix = isCompressed ? '-compressed' : '';
    return (`/img/${size}${compressedSuffix}/${restaurant.photograph}.jpg`);
  }

  /**
   * Map marker for a restaurant.
   */
  static mapMarkerForRestaurant(restaurant, map) {
    const marker = new google.maps.Marker({
      position: restaurant.latlng,
      title: restaurant.name,
      url: DBHelper.urlForRestaurant(restaurant),
      map: map,
      animation: google.maps.Animation.DROP}
    );
    return marker;
  }

}
