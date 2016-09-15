'use strict';

describe('Service: genericData', function () {

  // load the service's module
  beforeEach(module('travel'));

  // instantiate service
  var genericData;
  beforeEach(inject(function (_genericData_) {
    genericData = _genericData_;
  }));

  it('should do something', function () {
    expect(!!genericData).toBe(true);
  });

});
