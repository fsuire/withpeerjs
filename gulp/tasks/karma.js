(function() {
  'use strict';

  // Run tests on the client code

  var karma = require('karma').server;

  exports.task = function(done) {
    karma.start({
      configFile: ROOT + '/karma.conf.js'
    }, done);
  };

})();
