(function() {
  'use strict';

  module.exports = serverInformationsRouter;

  serverInformationsRouter['@singleton'] = true;
  serverInformationsRouter['@require'] = ['services/config'];

  function serverInformationsRouter(config) {

    return function(httpApp) {

      httpApp.get('/serverInformations', getServerInformations);
    }

    ////////////////

    function getServerInformations(req, res, next) {
      res.status(200);
      res.header('Content-Type: application/json');
      res.send(config);
    }

  }

})();
