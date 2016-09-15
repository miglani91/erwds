'use strict';

describe('Service: skyscannerservice', function () {

  // load the service's module
  beforeEach(module('travel'));

  // instantiate service
  var skyscannerservice;
  beforeEach(inject(function (_skyscannerservice_) {
    skyscannerservice = _skyscannerservice_;
  }));

  it('should do something', function () {
    expect(!!skyscannerservice).toBe(true);
  });

});
