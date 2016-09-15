'use strict';

describe('Controller: GridViewCtrl', function () {

  // load the controller's module
  beforeEach(module('travel'));

  var GridViewCtrl,
    scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    GridViewCtrl = $controller('GridViewCtrl', {
      $scope: scope
      // place here mocked dependencies
    });
  }));

  it('should attach a list of awesomeThings to the scope', function () {
    expect(GridViewCtrl.awesomeThings.length).toBe(3);
  });
});
