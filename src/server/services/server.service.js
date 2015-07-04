(function() {
  'use strict';

  module.exports = server;

  server['@singleton'] = true;
  server['@require'] = ['services/httpApp.service'];

  function server(httpApp) {
    var server = httpApp.listen(3000);

    return server;
  }

})();
