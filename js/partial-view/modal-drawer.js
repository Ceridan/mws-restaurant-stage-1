/**
* Modal drawer code to implement open/close behaviour of drawer and also to trap the tabs inside drawer
* This code based on the Rob Dodson's code from the Udacity Mobile Web Specialist nanodegree program,
* Web Accesebility course, Lesson name: Focus
*/
module.exports.default = (function() {
  // Keyboard codes of tab, space, enter and escape buttons
  const KB_TAB = 9;
  const KB_SPACE = 32;
  const KB_ENTER = 13;
  const KB_ESCAPE = 27;

  // Will hold previously focused element
  let focusedElementBeforeModal;

  // Find the modal drawer and its overlay
  const modal = document.querySelector('.modal-drawer');
  const modalOverlay = document.querySelector('.modal-overlay');

  // Find element which opens the modal drawer
  const modalToggle = document.querySelector('.modal-toggle');
  modalToggle.addEventListener('click', function(e) {
    openModal();
    e.stopPropagation();
  });

  // Open modal drawer
  function openModal() {
    // Save current focus
    focusedElementBeforeModal = document.activeElement;

    // Show modal drawer and overlay
    modal.classList.toggle('open');
    modalOverlay.classList.toggle('open');

    // Add animation to modal drawer open/close operations
    modal.classList.toggle('modal-animation');

    // Listen for and trap the keyboard
    modal.addEventListener('keydown', trapTabKey);
    modal.addEventListener('click', function(e) {
      e.stopPropagation();
    });

    // Listen for indicators to close the modal
    modalOverlay.addEventListener('click', closeModal);

    // Find element which clothes the modal drawer
    const modalCloseButton = document.querySelector('.modal-close');
    modalCloseButton.addEventListener('click', closeModal);

    // Find all focusable children
    const focusableElementsString = 'a[role="button"], a[href], area[href], input:not([disabled]), select:not([disabled]), textarea:not([disabled]), button:not([disabled]), iframe, object, embed, [tabindex="0"], [contenteditable]';
    let focusableElements = modal.querySelectorAll(focusableElementsString);

    // Convert NodeList to Array
    focusableElements = Array.prototype.slice.call(focusableElements);

    // Sort elements order by tab indexes
    Array.prototype.sort.call(focusableElements, function(el1, el2) {
      const tabindex1 = parseInt(el1.getAttribute('tabindex')) || 9999;
      const tabindex2 = parseInt(el2.getAttribute('tabindex')) || 9999;

      return tabindex1 - tabindex2;
    });

    const firstTabStop = focusableElements[0];
    const lastTabStop = focusableElements[focusableElements.length - 1];

    // Focus first child
    firstTabStop.focus();

    // Catch tab key and trap it inside modal drawer
    function trapTabKey(e) {
      // Check for TAB key press
      if (e.keyCode === KB_TAB) {

        // SHIFT + TAB
        if (e.shiftKey) {
          if (document.activeElement === firstTabStop) {
            e.preventDefault();
            lastTabStop.focus();
          }

        // TAB
        } else {
          if (document.activeElement === lastTabStop) {
            e.preventDefault();
            firstTabStop.focus();
          }
        }
      }

      // ESCAPE
      if (e.keyCode === KB_ESCAPE) {
        closeModal();
      }
    }

    // Close modal drawer and hide overlay
    function closeModal() {
      // Hide the modal drawer and overlay
      modal.classList.remove('open');
      modalOverlay.classList.remove('open');

      // Remove keydown event listener to remove trap on tabs
      modal.removeEventListener('keydown', trapTabKey);

      // Set focus back to element that had it before the modal was opened
      focusedElementBeforeModal.focus();
    }
  }
}());
