(function() {
  'use strict';

  module.exports = httpServer;

  httpServer['@singleton'] = true;
  httpServer['@require'] = ['http', 'express-rewrite', 'app/application', 'services/config'];

  function httpServer(http, rewriter, app, config) {

    var server = http.Server(app);

    server.listen(config.port, config.ipaddress, listen);

    return server;

    function listen() {
      app.use(rewriter);

      console.log('Example app listening at http://%s:%s', config.ipaddress, config.port);
    }

  }

})();
