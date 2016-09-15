'use strict';

describe('Controller: BlockviewCtrl', function () {

  // load the controller's module
  beforeEach(module('travel'));

  var BlockviewCtrl,
    scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    BlockviewCtrl = $controller('BlockviewCtrl', {
      $scope: scope
      // place here mocked dependencies
    });
  }));

  it('should attach a list of awesomeThings to the scope', function () {
    expect(BlockviewCtrl.awesomeThings.length).toBe(3);
  });
});
