'use strict';

/**
 * @ngdoc function
 * @name travel.controller:ContactUsCtrl
 * @description
 * # ContactUsCtrl
 * Controller of the travel
 */
angular.module('travel')
  .controller('ContactUsCtrl', function ($scope, genericData) {
    $scope.contactUsObj = {};
    var sendEmail = function () {
      $scope.loading = true;
      genericData.sendEmail($scope.contactUsObj).then(function () {
        $scope.loading = false;
        $scope.success = true;
      }, function (error) {
        $scope.loading = false;
        $scope.error = true;
      });
    };
    $scope.sendEmail = sendEmail;
    $scope.loading = false;
    $scope.success = false;
  });
