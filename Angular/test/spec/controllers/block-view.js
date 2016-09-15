'use strict';

describe('Controller: BlockViewCtrl', function () {

  // load the controller's module
  beforeEach(module('travel'));

  var BlockViewCtrl,
    scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    BlockViewCtrl = $controller('BlockViewCtrl', {
      $scope: scope
      // place here mocked dependencies
    });
  }));

  it('should attach a list of awesomeThings to the scope', function () {
    expect(BlockViewCtrl.awesomeThings.length).toBe(3);
  });
});
