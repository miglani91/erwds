'use strict';

/**
 * @ngdoc function
 * @name travel.controller:MainCtrl
 * @description
 * # MainCtrl
 * Controller of the travel
 */
angular.module('travel')
  .controller('MainCtrl', function ($scope, $timeout, themeService, skyscannerService, genericData) {
    //Configure theme
    $scope.$on('$stateChangeSuccess', function () {
      $timeout(function () {
        themeService.runWindowOnLoadCallbacks();
        themeService.runThemeOnReadyCallbacks();
      }, 0);
    });

    var getCountries = function () {
      var object = skyscannerService.getCountries();
      if (object.then) {
        object.then(function (data) {
          $scope.countries = skyscannerService.extractCountries(data);
          $scope.currentCountry = skyscannerService.getCountry();
          getCurrencies();
        })
      } else {
        $scope.countries = object;
        $scope.currentCountry = skyscannerService.getCountry();
        getCurrencies();
      }
    }
    var getCurrencies = function () {
      var object = skyscannerService.getCurrencies();
      if (object.then) {
        object.then(function (data) {
          $scope.currencies = skyscannerService.extractCurrencies(data);
          $scope.currentCurrency = skyscannerService.getCurrency();
          $scope.$broadcast('APP_READY');
        })
      } else {
        $scope.currencies = object;
        $scope.currentCurrency = skyscannerService.getCurrency();
      }
    }
    var setCountry = function (code) {
      skyscannerService.setCountry(code);
      $scope.currentCountry = skyscannerService.getCountry();
      $scope.$broadcast('COUNTRY_CHANGED');
    };
    var setCurrency = function (code) {
      skyscannerService.setCurrency(code);
      $scope.currentCurrency = skyscannerService.getCurrency();
      $scope.$broadcast('CURRENCY_CHANGED');
    };
    getCountries();
    //getCurrencies();
    $scope.setCountry = setCountry;
    $scope.setCurrency = setCurrency;
    $scope.isMobile = themeService.isMobileScreen();
    $scope.configureDateElements = themeService.configureDateElements;
    $scope.checkValidAutocomplete = function (id, val) {
      if (!val || !val.originalObject) {
        $scope.$broadcast('angucomplete-alt:clearInput', id);
      }
    }
    $scope.selectAllText = function (id) {
      var ele = angular.element('#' + id + "_value")
      if (ele) {
        ele.select();
      }
    };
    $scope.validateForm = function(form) {
			var result = form ? form.$valid : false;
			return result;
		}
    $scope.messages = {
      'required' : 'Please fill this field.',
      'infantsGreaterThanAdults' : 'Cannot be greater than number of adults',
      'invalidEmail' : 'Please enter a valid email.'
    }
    $scope.getLength = function(obj){
      if(obj){
        return Object.keys(obj).length;
      } else {
        return 0;
      }
    }
    $scope.range = genericData.range;
    $scope.seatRange = genericData.getSeatRange();
    $scope.tripTypes = genericData.getTripTypes();
  });
