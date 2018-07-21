import { Restaurant } from '../models/restaurant';
import { LatLng } from '../models/latlng';
import { RestaurantService } from '../services/restaurant-service';
import { GoogleMapService } from '../services/google-map-service';
import { HtmlElementBuilder } from '../helpers/html-element-builder';

export class MainPageHandler {
  constructor() {
    this.googleMapService = new GoogleMapService();
    this.restaurantService = new RestaurantService();
    this.intersectionObserver = this.createIntersactionObserver();
    this.restaurants = [];
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
   * Creates picture element and adds it to the restaurant card
   * @param {HTMLLIElement} restaurantListItemElement restaurant card list item element
   */
  fillPictureHtml(restaurantListItemElement) {
    const detailsAnchorElement = restaurantListItemElement.querySelector('a[name="details"]');
    const detailsUrl = new URL(detailsAnchorElement.href);
    const restaurantId = detailsUrl.searchParams.get('id');

    this.restaurantService.getRestaurantById(restaurantId)
      .then(restaurant => {
        const picture = HtmlElementBuilder.createPictureElement(restaurant);
        restaurantListItemElement.insertBefore(picture, restaurantListItemElement.firstChild);
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
        this.restaurants = restaurants;
      })
      .catch(err => console.error(err));
  }

  /**
   * Clear current restaurants, their HTML and remove their map markers
   */
  resetRestaurants() {
    // Remove all restaurants
    this.restaurants = [];
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
      const li = HtmlElementBuilder.createRestaurantListItemElement(restaurant);
      this.intersectionObserver.observe(li);
      ul.append(li);
    });
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
    this.googleMapService.addMarkersToMap(this.restaurants);
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

  /**
   * Create an instance of the inresaction observer for lazy loading of restaurant images
   * @returns {IntersectionObserver}
   */
  createIntersactionObserver() {
    return new IntersectionObserver( entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          this.fillPictureHtml(entry.target);
          this.intersectionObserver.unobserve(entry.target);
        }
      });
    });
  }
}
