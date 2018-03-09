/*
  * Open the drawer when the menu ison is clicked.
  */
var menu = document.querySelector('#hamburger-menu');
var main = document.querySelector('main');
var filter = document.querySelector('.filter-options');
var filterNeighborhoods = document.querySelector('#neighborhoods-select');
var filterCuisines = document.querySelector('#cuisines-select');

menu.addEventListener('click', function(e) {
  filter.classList.toggle('open');
  e.stopPropagation();
});

filter.addEventListener('click', function(e) {
  e.stopPropagation();
});

filterCuisines.addEventListener('change', function() {
  filter.classList.remove('open');
});

filterNeighborhoods.addEventListener('change', function() {
  filter.classList.remove('open');
});

main.addEventListener('click', function() {
  filter.classList.remove('open');
});
