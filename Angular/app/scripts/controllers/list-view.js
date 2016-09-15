'use strict';

/**
 * @ngdoc function
 * @name travel.controller:ListViewCtrl
 * @description
 * # ListViewCtrl
 * Controller of the travel
 */
angular.module('travel')
  .controller('ListViewCtrl', ['themeService',function (themeService) {
   		themeService.configurePriceSlider();
  }]);
