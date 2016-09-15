'use strict';

/**
 * @ngdoc overview
 * @name travel
 * @description
 * # travel
 *
 * Main module of the application.
 */
angular
  .module('travel', [
    // 'ngCookies',
    // 'ngMessages',
    // 'ngResource',
    // 'ngSanitize',
    // 'ngTouch',
    'ui.router',
    'angucomplete-alt',
    'rzModule'
  ]).config(['$stateProvider', '$urlRouterProvider','$locationProvider',function($stateProvider, $urlRouterProvider,$locationProvider){
  	  $urlRouterProvider.otherwise("/");
  	 $stateProvider
    .state('home', {
      url: "/",
      templateUrl: "views/home.html",
      controller : 'HomeCtrl'
    }).state('list-view', {
      url: "/list-view",
      templateUrl: "views/list-view.html",
      controller : 'ListViewCtrl'
    }).state('grid-view', {
      url: "/grid-view",
      templateUrl: "views/grid-view.html",
      controller : 'GridViewCtrl'
    }).state('block-view', {
      url: "/block-view",
      templateUrl: "views/block-view.html",
      controller : 'BlockViewCtrl'
    }).state('detailed-view', {
      url: "/detailed-view",
      templateUrl: "views/detailed-view.html",
      controller : 'DetailedViewCtrl'
    }).state('about-us', {
      url: "/about-us",
      templateUrl: "views/about-us.html",
      controller : 'AboutUsCtrl'
    }).state('contact-us', {
      url: "/contact-us",
      templateUrl: "views/contact-us.html",
      controller : 'ContactUsCtrl'
    }).state('search', {
      url: "/search/:locations/:locationDescs/:dates/:who/:cabinClass/:directFlights/:sessionUrl",
      templateUrl: "views/search-results.html",
      controller : 'SearchResultsCtrl'/*,
      params : {
        sessionUrl : ""
      }*/
    });
    $locationProvider.hashPrefix('!');
    //$locationProvider.html5Mode(true);
  }]);
