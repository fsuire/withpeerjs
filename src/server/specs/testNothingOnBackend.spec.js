(function() {
  'use strict';

  var IoC = require('./bootstrap');

  var config = IoC.create('services/config');

  describe('Just to see if tests can be runned on backend', function() {

    it('should test that true is true', function() {
      expect(true).toBe(true);
    });

  });

})();
