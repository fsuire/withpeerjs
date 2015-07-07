(function() {
  'use strict';

  module.exports = application;

  application['@singleton'] = true;
  application['@require'] = ['express', 'services/config', 'services/httpApp.service', 'services/server.service', 'services/peerServer.service', 'routers/tchat.router', 'routers/serverInformations.router'];

  function application(express, config, httpApp, server, peerServer, tchatRouter, serverInfo) {

    // static directories
    // httpApp.use('/', express.static('dist/dev/client'));
    // httpApp.use('/bower_components', express.static('bower_components'));
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
