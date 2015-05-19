(function() {
  'use strict';

  module.exports = socketIOService;

  socketIOService['@singleton'] = true;
  socketIOService['@require'] = [
    'socket.io',
    'services/http.service',
    'services/config'
  ];

  function socketIOService(socketIO, server, config) {

    var io = socketIO(server);

    io.on('connection', function(socket) {
      console.log('a user connected');
    });

  }

})();
