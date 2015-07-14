(function() {
  'use strict';

  angular
    .module('blocks.peer')
    .factory('peer', peerFactory);

  peerFactory.$inject = ['$http', 'sse', 'peerConnections'];

  /**
   * @ngdoc Factory
   * @memberOf blocks.peer
   * @name peerFactory
   *
   * @description
   * Returns the Peer constructor
   *
   * @returns {object} - The peer service
   */
  function peerFactory($http, sse, peerConnections) {
    /* global Peer:false */
    var _listeners = {};

    var service = {
      peer: null,
      user: {
        nickname: null,
        rtcId: null
      },

      connectToServer: connectToServer,
      createDataConnection: createDataConnection,

      on: on
    };

    return service;

    ////////////////

    function connectToServer() {
      if(!service.peer) {
        $http.get('/serverInformations').success(function(data) {
          service.peer = new Peer({
            host: '/',
            port: data.peerjs.port
          });

          service.peer.on('open', onConnectionOpened);
          service.peer.on('connection', onDataConnection);

          sse.on('list:change', onRegisteredPeerList);
        });
      }
    }

    function createDataConnection(rtcId, metadata) {
      var dataConnection = service.peer.connect(rtcId, {
        metadata: metadata
      });
      console.log('----->', dataConnection);
      return dataConnection;
    }

    function on(eventName, listener) {
      console.log('a new listener has been initialized on peer.service', eventName);
      if(angular.isUndefined(_listeners[eventName])) {
        _listeners[eventName] = [];
      }
      _listeners[eventName].push(listener);
    }

    function emit(eventName, data) {
      console.log('peer.service is emitting', eventName, data);
      if(angular.isDefined(_listeners[eventName])) {
        angular.forEach(_listeners[eventName], function(listener) {
          listener(data);
        });
      }
    }

    ////////////////

    function onConnectionOpened(id) {
      service.user.rtcId = id;

      $http
        .put('/tchat/register/' + service.user.nickname + '/' + service.user.rtcId + '/' + sse.id)
        .success(function(data, status, headers, config) {
          console.log('--> connected <---');
        });
    }

    function onDataConnection(dataConnection) {
      console.log('<-----', dataConnection);
      emit('new-dataconnection-received', dataConnection);
    }

    function onRegisteredPeerList(data) {
      delete data[service.user.rtcId];

      peerConnections.setList(data);
    }

  }
})();
