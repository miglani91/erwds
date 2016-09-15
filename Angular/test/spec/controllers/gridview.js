'use strict';

describe('Controller: GridviewCtrl', function () {

  // load the controller's module
  beforeEach(module('travel'));

  var GridviewCtrl,
    scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    GridviewCtrl = $controller('GridviewCtrl', {
      $scope: scope
      // place here mocked dependencies
    });
  }));

  it('should attach a list of awesomeThings to the scope', function () {
    expect(GridviewCtrl.awesomeThings.length).toBe(3);
  });
});
