'use strict';

describe('Controller: ListviewCtrl', function () {

  // load the controller's module
  beforeEach(module('travel'));

  var ListviewCtrl,
    scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    ListviewCtrl = $controller('ListviewCtrl', {
      $scope: scope
      // place here mocked dependencies
    });
  }));

  it('should attach a list of awesomeThings to the scope', function () {
    expect(ListviewCtrl.awesomeThings.length).toBe(3);
  });
});
