'use strict';

/**
 * @ngdoc function
 * @name travel.controller:HomeCtrl
 * @description
 * # HomeCtrl
 * Controller of the travel
 */
angular.module('travel')
  .controller('HomeCtrl', function ($scope, $timeout, themeService, skyscannerService, genericData, $state) {
    var init = function () {
      themeService.configureRevolutionSlider();
    };

    var getRouteData = function (sessionUrl) {
      var obj = {};
      var delimiter = "^";
      obj.locations = $scope.searchObj.leavingFrom.originalObject.PlaceId + delimiter + $scope.searchObj.goingTo.originalObject.PlaceId;
      obj.locationDescs = skyscannerService.getPlaceTitle($scope.searchObj.leavingFrom.originalObject) + delimiter + skyscannerService.getPlaceTitle($scope.searchObj.goingTo.originalObject)
      obj.dates = moment($scope.searchObj.fromDate, "MM/DD/YYYY").format("YYYYMMDD");
      if ($scope.searchObj.toDate) {
        obj.dates = obj.dates + delimiter + moment($scope.searchObj.toDate, "MM/DD/YYYY").format("YYYYMMDD");
      }
      obj.who = $scope.searchObj.adults + delimiter + $scope.searchObj.kids + delimiter + $scope.searchObj.infants;
      obj.cabinClass = $scope.searchObj.cabinClass;
      obj.directFlights = $scope.searchObj.directFlights;
      console.log(obj);
      return obj;
    };
    var search = function () {
      if ($scope.searchObj.infants > $scope.searchObj.adults) {
        return;
      }
      if ($scope.searchObj.tripType != 'RET') {
        $scope.searchObj.toDate = null;
      }
      console.log($scope.searchObj);
      var routeData = getRouteData();
      $scope.searchObj.leavingFrom = $scope.searchObj.leavingFrom.originalObject.PlaceId;
      $scope.searchObj.goingTo = $scope.searchObj.goingTo.originalObject.PlaceId;
      $scope.searching = true;
      skyscannerService.createSearchSession($scope.searchObj).then(function (response) {
        var sessionUrl = skyscannerService.getSearchSessionUrl(response);
        if (sessionUrl) {
          routeData.sessionUrl = sessionUrl;
          $state.go('search', routeData);
        }
      }, function (error) {
        $scope.searching = false;
      });
    };
    var resetSearchFormData = function () {
      var searchObj = {
        tripType: $scope.tripTypes[0].key,
        adults: 1,
        kids: 0,
        infants: 0,
        cabinClass: $scope.cabinClasses[0].key,
        directFlights: false,
        groupPricing: false
      };
      searchObj.fromDate = moment().format('MM/DD/YYYY');
      searchObj.toDate = moment().add(1, 'days').format('MM/DD/YYYY');
      $scope.searchObj = searchObj;
    };
    var signUp = function(){
      $scope.signUpRequest = true;
      genericData.signUp($scope.signUpObj).then(function(){
        $scope.signUpSuccess  = true;
      },function(){
        $scope.signUpError  = true;
      })
    };
    
    $scope.cabinClasses = genericData.getCabinClasses();
    $scope.getSuggestedLocationsUrl = skyscannerService.getSuggestedLocationsUrl;
    $scope.formatSuggestedLocationsRequest = skyscannerService.formatSuggestedLocationsRequest;
    $scope.formatSuggestedLocationsResponse = skyscannerService.formatSuggestedLocationsResponse;
    
    $scope.init = init;
    $scope.search = search;
    resetSearchFormData();
    
    $timeout(function () {
      angular.element("#leavingFrom_value").focus();
    }, 0);
    $scope.searching = false;
    $scope.signUpObj = {};
    $scope.signUp = signUp;
  });
