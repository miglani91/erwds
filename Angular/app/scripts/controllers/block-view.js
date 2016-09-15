'use strict';

/**
 * @ngdoc function
 * @name travel.controller:BlockViewCtrl
 * @description
 * # BlockViewCtrl
 * Controller of the travel
 */
angular.module('travel')
  .controller('BlockViewCtrl', ['themeService',function (themeService) {
   		themeService.configurePriceSlider();
  }]);
