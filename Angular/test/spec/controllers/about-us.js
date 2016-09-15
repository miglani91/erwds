'use strict';

describe('Controller: AboutUsCtrl', function () {

  // load the controller's module
  beforeEach(module('travel'));

  var AboutUsCtrl,
    scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    AboutUsCtrl = $controller('AboutUsCtrl', {
      $scope: scope
      // place here mocked dependencies
    });
  }));

  it('should attach a list of awesomeThings to the scope', function () {
    expect(AboutUsCtrl.awesomeThings.length).toBe(3);
  });
});
