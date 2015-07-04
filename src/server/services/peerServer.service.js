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

    peerApp.on('connection', peerConnection);

    return peerApp;

    ////////////////

    function peerConnection(id) {
      console.log('peer connection', id);
//      console.log(peerApp._clients.peerjs[id]);
    }

  }

})();
