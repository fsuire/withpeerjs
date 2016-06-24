(function() {
  'use strict';

  module.exports = peerServer;

  peerServer['@singleton'] = true;
  peerServer['@require'] = ['peer', 'services/server.service', 'services/httpApp.service'];

  function peerServer(peer, server, httpApp) {

    var PeerServer = peer.ExpressPeerServer;

    var peerServerOptions = {
      debug: true
    };

    var peerApp = PeerServer(server, peerServerOptions);

    /*peerApp.on('connection', peerConnection);
    peerApp.on('disconnect', peerDisconnection);*/

    return peerApp;

    ////////////////

    /*function peerConnection(id) {
    }

    function peerDisconnection(id) {
    }*/

  }

})();
