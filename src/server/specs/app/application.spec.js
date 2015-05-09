(function() {
  'use strict';

  var _ = require('lodash');
  var sinon = require('sinon');

  var application = require(__dirname + '/../../app/application.js');

  describe('app/application', function() {
    var IoC, express, config;

    beforeEach(function() {
      IoC = {
        create: function() {
          return function() {};
        }
      };

      express = {
        express: function() {
          return 'express app';
        }
      };

      config = {
        routes: ['one', 'two', 'three']
      };

    });

    afterEach(function() {
      IoC = null;
      express = null;
      config = null;
    });

    it('should create an express application', function() {

      sinon.spy(IoC, 'create');
      sinon.spy(express, 'express');

      var app = application(IoC, _, express.express , config);

      expect(express.express.callCount).toBe(1);
      expect(IoC.create.callCount).toBe(3);

      expect(app).toBe('express app');
    });

  });

})();
