const KB_TAB = 9;
const KB_SPACE = 32;
const KB_ENTER = 13;
const KB_ESCAPE = 27;

/*
  * Open the drawer when the menu ison is clicked.
  */
var menu = document.querySelector('#hamburger-menu');
var main = document.querySelector('main');
var filter = document.querySelector('.filter-options');
var filterNeighborhoods = document.querySelector('#neighborhoods-select');
var filterCuisines = document.querySelector('#cuisines-select');

menu.addEventListener('click', function(e) {
  openFilterDrawer();
  e.stopPropagation();
});

menu.addEventListener('keydown', function(e) {
  if (e.keyCode === KB_SPACE || e.keyCode === KB_ENTER) {
    openFilterDrawer();
    e.preventDefault();
    e.stopPropagation();
  }
});

filter.addEventListener('click', function(e) {
  e.stopPropagation();
});

filter.addEventListener('keydown', function(e) {
  if (e.keyCode === KB_ESCAPE) {
    closeFilterDrawer();
  }
  console.log(e);
});

filterCuisines.addEventListener('change', function() {
  closeFilterDrawer();
});

filterNeighborhoods.addEventListener('change', function() {
  closeFilterDrawer();
});

main.addEventListener('click', function() {
  closeFilterDrawer();
});

function openFilterDrawer() {
  filter.classList.toggle('open');
  filterNeighborhoods.focus();
}

function closeFilterDrawer() {
  filter.classList.remove('open');
  menu.focus();
}
