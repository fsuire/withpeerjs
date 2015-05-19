(function() {
  'use strict';

  module.exports = socketIOService;

  socketIOService['@singleton'] = true;
  socketIOService['@require'] = [
    'socket.io',
    'services/http.service'
  ];

  function socketIOService(socketIO, server) {
    var io = socketIO(server);

    io.on('connection', connection);

    return io;

    function connection(socket) {
      console.log('a user connected');

      socket.on('disconnect', disconnection);
      socket.on('chat:message', messageReceived);
    }

    function disconnection() {
      console.log('a user disconnected');
    }

    function messageReceived(message) {
      console.log('message received :', message);
      io.emit('chat:message', message);
    }

  }

})();
