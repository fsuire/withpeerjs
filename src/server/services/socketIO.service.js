(function() {
  'use strict';

  module.exports = socketIOService;

  socketIOService['@singleton'] = true;
  socketIOService['@require']   = [
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

      socket.on('rtc:offer', rtcOfferReceived(socket));
      socket.on('rtc:answer', rtcAnswerReceived(socket));
      socket.on('rtc:candidate', rtcCandidateReceived(socket));
    }

    function disconnection() {
      console.log('a user disconnected');
    }

    function messageReceived(message) {
      console.log('message received :', message);
      io.emit('chat:message', message);
    }

    function rtcOfferReceived(socket) {
      return function(offer) {
        console.log('offer received');
        socket.broadcast.emit('rtc:offer', offer);
      }
    }

    function rtcAnswerReceived(socket) {
      return function(answer) {
        console.log('answer received');
        socket.broadcast.emit('rtc:answer', answer);
      }
    }

    function rtcCandidateReceived(socket) {
      return function(candidate) {
        console.log('candidate received');
        socket.broadcast.emit('rtc:candidate', candidate);
      }
    }
  }

})();
