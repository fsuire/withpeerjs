(function() {
  'use strict';

  module.exports = sse;

  sse['@singleton'] = true;
  sse['@require'] = ['lodash', 'sse', 'services/server.service'];

  function sse(_, SSE, server) {
    var sse = new SSE(server);

    var clients = {};

    sse.on('connection', function(client) {
      var sseId = _.uniqueId();
      var message = createEvent('register', {
        sseId: sseId,
      });
      clients[sseId] = client;

      client.send(message);
    });

    return {
      createEvent: createEvent,
      sendToEveryone: sendToEveryOne,
      getRegisteredClientList: getRegisteredClientList
    };

    ////////////////

    function createEvent(eventname, data) {
      return JSON.stringify({
        event: eventname,
        data: data
      });
    }

    function sendToEveryOne(data, but) {

      if(!_.isArray(but)) {
        if(!but) {
          but = [];
        } else {
          but = [but];
        }
      }

      _.forEach(clients, function(client, id) {
        if(!_.includes(but, id)) {
          client.send(data);
        }
      });

    }

    function getRegisteredClientList() {
      return clients;
    }
  }

})();
