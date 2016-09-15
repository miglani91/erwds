'use strict';

describe('Service: themeService', function () {

  // load the service's module
  beforeEach(module('travel'));

  // instantiate service
  var themeService;
  beforeEach(inject(function (_themeService_) {
    themeService = _themeService_;
  }));

  it('should do something', function () {
    expect(!!themeService).toBe(true);
  });

});
