'use strict';

describe('Controller: ListViewCtrl', function () {

  // load the controller's module
  beforeEach(module('travel'));

  var ListViewCtrl,
    scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    ListViewCtrl = $controller('ListViewCtrl', {
      $scope: scope
      // place here mocked dependencies
    });
  }));

  it('should attach a list of awesomeThings to the scope', function () {
    expect(ListViewCtrl.awesomeThings.length).toBe(3);
  });
});
