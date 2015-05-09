(function() {
  'use strict';

  var IoC = require('../bootstrap');
  var _ = require('lodash');

  var config = IoC.create('services/config');

  describe('Just to see if tests can be runned on backend', function() {

    it('should test that true is true', function() {
      expect(_.isObject(config)).toBe(true);
      expect(_.isArray(config)).not.toBe(true);
      expect(_.isFunction(config)).not.toBe(true);
    });

  });

})();
