'use strict';

/**
 * @ngdoc function
 * @name travel.controller:GridViewCtrl
 * @description
 * # GridViewCtrl
 * Controller of the travel
 */
angular.module('travel')
  .controller('GridViewCtrl', ['themeService',function (themeService) {
   		themeService.configurePriceSlider();
  }]);
