'use strict';

describe('steempoll.version module', function() {
  beforeEach(module('steempoll.version'));

  describe('version service', function() {
    it('should return current version', inject(function(version) {
      expect(version).toEqual('0.1');
    }));
  });
});
