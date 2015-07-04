(function() {
  'use strict';

  module.exports = httpApp;

  httpApp['@singleton'] = true;
  httpApp['@require'] = ['express'];

  function httpApp(express) {
    var app = express();

    return app
  }

})();
