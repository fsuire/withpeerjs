(function() {
  'use strict';

  module.exports = application;

  application['@singleton'] = true;
  application['@require'] = ['express', 'services/config', 'services/httpApp.service', 'services/server.service', 'services/peerServer.service', 'routers/tchat.router', 'routers/serverInformations.router'];

  function application(express, config, httpApp, server, peerServer, tchatRouter, serverInfo) {

    // static directories
    for(var i in config.staticDirectories) {
      httpApp.use(i, express.static(config.staticDirectories[i]));
    }

    // application routers
    tchatRouter(httpApp);
    serverInfo(httpApp);

    // peer server
    httpApp.use(peerServer);
  }

})();
