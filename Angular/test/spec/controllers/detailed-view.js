'use strict';

describe('Controller: DetailedViewCtrl', function () {

  // load the controller's module
  beforeEach(module('travel'));

  var DetailedViewCtrl,
    scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    DetailedViewCtrl = $controller('DetailedViewCtrl', {
      $scope: scope
      // place here mocked dependencies
    });
  }));

  it('should attach a list of awesomeThings to the scope', function () {
    expect(DetailedViewCtrl.awesomeThings.length).toBe(3);
  });
});
