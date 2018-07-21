import { MainPageHandler } from './page-handlers/main-page-handler';
import './partial-view/modal-drawer';
import { ScriptLoader } from './helpers/load-scripts';

(function() {
  const pageHandler = new MainPageHandler();

  /**
   * Register service worker and fetch neighborhoods and cuisines as soon as the page is loaded
   */
  window.addEventListener('load', () => {
    // Register service worker
    if (navigator.serviceWorker) {
      navigator.serviceWorker.register('/service-worker.js', {
        scope: '/'
      });
    }

    pageHandler.fetchCusines();
    pageHandler.fetchNeighborhoods();
    pageHandler.updateRestaurants();
    pageHandler.setPageEventListeners();

    ScriptLoader.loadScript('https://maps.googleapis.com/maps/api/js?key=YOUR_GOOGLE_MAPS_API_KEY&libraries=places&callback=initMap');
  });

  /**
   * Initialize Google map, called from HTML
   */
  window.initMap = () => {
    pageHandler.fillMapHtml();
  };
}());
