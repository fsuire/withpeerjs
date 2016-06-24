(function() {
  'use strict';

  module.exports = server;

  server['@singleton'] = true;
  server['@require'] = ['services/config', 'services/httpApp.service'];

  function server(config, httpApp) {
    var server = httpApp.listen(config.port, config.ipaddress, function() {
      console.log('HTTP server listening on ' + config.ipaddress + ':' + config.port);
    });
    return server;
  }

})();
