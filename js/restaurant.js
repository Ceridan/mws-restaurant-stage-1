import { RestaurantPageHandler } from './page-handlers/restaurant-page-handler';

(function() {
  const pageHandler = new RestaurantPageHandler();

  /**
   * Update restaurant detail on load
   */
  window.addEventListener('load', () => {
    pageHandler.updateRestaurant();
  });

  /**
   * Initialize Google map, called from HTML
   */
  window.initMap = () => {
    pageHandler.fillMapHtml();
  };
}());
