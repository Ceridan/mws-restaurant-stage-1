import { MainPageHandler } from './page-handlers/main-page-handler';
import './partial-view/modal-drawer';

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
  });

  /**
   * Initialize Google map, called from HTML
   */
  window.initMap = () => {
    pageHandler.fillMapHtml();
  };
}());
