'use strict';

describe('Service: skyscannerService', function () {

  // load the service's module
  beforeEach(module('travel'));

  // instantiate service
  var skyscannerService;
  beforeEach(inject(function (_skyscannerService_) {
    skyscannerService = _skyscannerService_;
  }));

  it('should do something', function () {
    expect(!!skyscannerService).toBe(true);
  });

});
