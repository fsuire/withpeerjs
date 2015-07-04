(function() {
  'use strict';

  module.exports = application;

  application['@singleton'] = true;
  application['@require'] = ['express','services/httpApp.service', 'services/server.service', 'services/peerServer.service', 'routers/tchat.router'];

  function application(express, httpApp, server, peerServer, tchatRouter) {

    // static directories
    httpApp.use('/', express.static('dist/dev/client'));
    httpApp.use('/bower_components', express.static('bower_components'));

    // application routers
    tchatRouter(httpApp);

    // peer server
    httpApp.use(peerServer);
  }

})();
