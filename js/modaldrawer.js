const KB_TAB = 9;
const KB_SPACE = 32;
const KB_ENTER = 13;
const KB_ESCAPE = 27;

// Will hold previously focused element
var focusedElementBeforeModal;

// Find the modal and its overlay
var modal = document.querySelector('.modal-drawer');
var modalOverlay = document.querySelector('.modal-overlay');

var modalToggle = document.querySelector('.modal-toggle');
modalToggle.addEventListener('click', function(e) {
  openModal();
  e.stopPropagation();
});

modalToggle.addEventListener('keydown', function(e) {
  if (e.keyCode === KB_SPACE || e.keyCode === KB_ENTER) {
    openModal();
    e.preventDefault();
  }
});

function openModal() {
  // Save current focus
  focusedElementBeforeModal = document.activeElement;

  modal.classList.toggle('open');

  // Listen for and trap the keyboard
  modal.addEventListener('keydown', trapTabKey);
  modal.addEventListener('click', function(e) {
    e.stopPropagation();
  });

  // Listen for indicators to close the modal
  modalOverlay.addEventListener('click', closeModal);
  // Sign-Up button
  // var signUpBtn = modal.querySelector('#signup');
  // signUpBtn.addEventListener('click', closeModal);

  // Find all focusable children
  var focusableElementsString = 'a[href], area[href], input:not([disabled]), select:not([disabled]), textarea:not([disabled]), button:not([disabled]), iframe, object, embed, [tabindex="0"], [contenteditable]';
  var focusableElements = modal.querySelectorAll(focusableElementsString);
  // Convert NodeList to Array
  focusableElements = Array.prototype.slice.call(focusableElements);

  var firstTabStop = focusableElements[0];
  var lastTabStop = focusableElements[focusableElements.length - 1];

  // Focus first child
  firstTabStop.focus();

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
}

function closeModal() {
  // Hide the modal
  modal.classList.remove('open');

  // Set focus back to element that had it before the modal was opened
  focusedElementBeforeModal.focus();
}
