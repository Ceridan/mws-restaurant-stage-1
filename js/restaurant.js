import { RestaurantPageHandler } from './page-handlers/restaurant-page-handler';
import { ScriptLoader } from './helpers/load-scripts';

(function() {
  const pageHandler = new RestaurantPageHandler();

  /**
   * Update restaurant detail on load
   */
  window.addEventListener('load', () => {
    pageHandler.updateRestaurant();
    ScriptLoader.loadScript('https://maps.googleapis.com/maps/api/js?key=YOUR_GOOGLE_MAPS_API_KEY&libraries=places&callback=initMap');
  });

  /**
   * Initialize Google map, called from HTML
   */
  window.initMap = () => {
    pageHandler.fillMapHtml();
  };
}());
