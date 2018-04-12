import { Restaurant } from '../models/restaurant';
import { LatLng } from '../models/latlng';
import { RestaurantService } from '../services/restaurant-service';
import { GoogleMapService } from '../services/google-map-service';
import { HtmlElementBuilder } from '../helpers/html-element-builder';

export class MainPageHandler {
  constructor() {
    this.googleMapService = new GoogleMapService();
    this.restaurantService = new RestaurantService();
  }

  /**
   * Fetch all neighborhoods and set their HTML
   */
  fetchNeighborhoods() {
    this.restaurantService.getNeighborhoods()
      .then(neighborhoods => {
        this.fillNeighborhoodsHtml(neighborhoods);
      })
      .catch(err => console.error(err));
  }

  /**
   * Fill neighborhoods filter on the page
   * @param {Array<string>} neighborhoods
   */
  fillNeighborhoodsHtml(neighborhoods) {
    const select = document.getElementById('neighborhoods-select');

    neighborhoods.forEach(neighborhood => {
      const option = document.createElement('option');
      option.innerHTML = neighborhood;
      option.value = neighborhood;
      select.append(option);
    });
  }

  /**
   * Fetch all cuisines and set their HTML
   */
  fetchCusines() {
    this.restaurantService.getCuisines()
      .then(cuisines => {
        this.fillCuisinesHtml(cuisines);
      })
      .catch(err => console.error(err));
  }

  /**
   * Fill cuisines filter on the page
   * @param {Array<string>} cuisines
   */
  fillCuisinesHtml(cuisines) {
    const select = document.getElementById('cuisines-select');

    cuisines.forEach(cuisine => {
      const option = document.createElement('option');
      option.innerHTML = cuisine;
      option.value = cuisine;
      select.append(option);
    });
  }

  /**
   * Update page and map for current restaurants
   */
  updateRestaurants() {
    const cSelect = document.getElementById('cuisines-select');
    const nSelect = document.getElementById('neighborhoods-select');

    const cIndex = cSelect.selectedIndex;
    const nIndex = nSelect.selectedIndex;

    const cuisine = cSelect[cIndex].value;
    const neighborhood = nSelect[nIndex].value;

    this.restaurantService.getRestaurantByCuisineAndNeighborhood(cuisine, neighborhood)
      .then(restaurants => {
        this.resetRestaurants();
        this.fillRestaurantsHtml(restaurants);
      })
      .catch(err => console.error(err));
  }

  /**
   * Clear current restaurants, their HTML and remove their map markers
   */
  resetRestaurants() {
    // Remove all restaurants
    const ul = document.getElementById('restaurants-list');
    ul.innerHTML = '';

    // Remove all map markers
    this.googleMapService.resetMarkers();
  }

  /**
   * Create all restaurants HTML and add them to the webpage
   * @param {Array<Restaurant>} restaurants array of restaurants
   */
  fillRestaurantsHtml(restaurants) {
    const ul = document.getElementById('restaurants-list');

    restaurants.forEach(restaurant => {
      ul.append(HtmlElementBuilder.createRestaurantListItemElement(restaurant));
    });

    this.googleMapService.addMarkersToMap(restaurants);
  }

  /**
   * Fill map element with google maps content
   */
  fillMapHtml() {
    const mapElement = document.getElementById('map');
    const initialLocation = new LatLng({
      lat: 40.722216,
      lng: -73.987501
    });
    const zoom = 12;

    this.googleMapService.initMap(mapElement, initialLocation, zoom);
  }

  /**
   * Set event listeners on filter elements
   */
  setPageEventListeners() {
    const cSelect = document.getElementById('cuisines-select');
    const nSelect = document.getElementById('neighborhoods-select');

    cSelect.onchange = () => {
      this.updateRestaurants();
    };

    nSelect.onchange = () => {
      this.updateRestaurants();
    };
  }
}