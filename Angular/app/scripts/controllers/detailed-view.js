'use strict';

/**
 * @ngdoc function
 * @name travel.controller:DetailedViewCtrl
 * @description
 * # DetailedViewCtrl
 * Controller of the travel
 */
angular.module('travel')
  .controller('DetailedViewCtrl', ['themeService',function (themeService) {
   		themeService.configureCalendar();
    }
]);

