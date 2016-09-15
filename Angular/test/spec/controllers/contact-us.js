'use strict';

describe('Controller: ContactUsCtrl', function () {

  // load the controller's module
  beforeEach(module('travel'));

  var ContactUsCtrl,
    scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    ContactUsCtrl = $controller('ContactUsCtrl', {
      $scope: scope
      // place here mocked dependencies
    });
  }));

  it('should attach a list of awesomeThings to the scope', function () {
    expect(ContactUsCtrl.awesomeThings.length).toBe(3);
  });
});
