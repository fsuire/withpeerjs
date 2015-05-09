(function() {
  'use strict';

  var _ = require('lodash');
  var sinon = require('sinon');
  var q = require('q');

  var errorsRoute = require(__dirname + '/../../routes/errors.route.js');

  describe('app/application', function() {
    var application, getHtml, config;

    beforeEach(function() {

      application = {
        useRoute: null,
        use: function(func) {
          this.useRoute = func;
        }
      };

      getHtml = {
        getHtml: function() {
        }
      };

      config = {
        htmlErrorPath: 'error.html'
      };

    });

    afterEach(function() {
      application = null;
      getHtml = null;
      config = null;
    });

    it('should send a 404 error', function(done) {

      var res = {
        status: sinon.spy(),
        setHeader: sinon.spy(),
        send: function(data) {
          expect(res.status.withArgs(404).calledOnce).toBe(true);
          expect(res.setHeader.withArgs('Content-Type', 'text/html').calledOnce).toBe(true);
          expect(data).toBe('I\'m a 404 error');
          done();
        }
      };

      sinon.spy(application, 'use');
      sinon.stub(getHtml, 'getHtml', function() {
        var deferred = q.defer();
        deferred.resolve('I\'m a 404 error');
        return deferred.promise;
      });

      var route = errorsRoute(getHtml.getHtml , config)(application);
      application.useRoute({}, res);

    });

    it('should send a 500 error', function(done) {

      var res = {
        status: sinon.spy(),
        setHeader: sinon.spy(),
        send: function(data) {
          expect(res.status.withArgs(500).calledOnce).toBe(true);
          expect(res.setHeader.calledOnce).not.toBe(true);
          expect(data).toBe('Oooups ! Error 500 ! "Internal Server Error" !');
          done();
        }
      };

      sinon.spy(application, 'use');
      sinon.stub(getHtml, 'getHtml', function() {
        var deferred = q.defer();
        deferred.reject('I\'m a 500 error');
        return deferred.promise;
      });

      var route = errorsRoute(getHtml.getHtml , config)(application);
      application.useRoute({}, res);

    });

  });

})();
