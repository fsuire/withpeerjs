(function() {
  'use strict';

  angular
    .module('blocks.peer')
    .factory('peer', peerFactory);

  peerFactory.$inject = ['$http', '$q', 'Pubsub', 'sse', 'peerConnections'];

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
  function peerFactory($http, $q, Pubsub, sse, peerConnections) {
    /* global Peer:false */
    var pubsub = new Pubsub();

    var _channels = {};
    var _dataConnections = {};

    var service = {
      peer: null,
      user: {
        nickname: null,
        rtcId: null
      },

      addChannel: addChannel,

      connectToServer: connectToServer,
      getDataconnection: getDataconnection,

      subscribe: pubsub.subscribe
    };

    return service;

    ////////////////

    function addChannel(channel, action) {
      _channels[channel] = action;
    }

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

    function getDataconnection(rtcId) {
      if(angular.isDefined(_dataConnections[rtcId])) {
        var deferred = $q.defer();
        deferred.resolve(_dataConnections[rtcId]);
        return deferred.promise;
      } else {
        return _createDataConnection(rtcId);
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
      _dataConnections[dataConnection.peer] = dataConnection;

      dataConnection.on('data', function(data) {
        console.log('data received !', data);
        data = JSON.parse(data);
        if(angular.isDefined(_channels[data.channel])) {
          _channels[data.channel](data.data);
        }
      });

      pubsub.publish('new-dataconnection-received', dataConnection);
    }

    function onRegisteredPeerList(data) {
      delete data[service.user.rtcId];

      peerConnections.setList(data);
    }

    ////////////////

    function _createDataConnection(rtcId) {
      var deferred = $q.defer();

      var dataConnection = service.peer.connect(rtcId);

      console.log('----->', dataConnection);

      dataConnection.on('open', function() {
        _dataConnections[rtcId] = dataConnection;
        console.log('connected with remote peer', rtcId);
        deferred.resolve(dataConnection);
      });

      return deferred.promise;
    }

  }
})();
