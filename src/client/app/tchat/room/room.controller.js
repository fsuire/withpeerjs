(function() {
  'use strict';

  angular
    .module('app.tchat')
    .controller('TchatRoomController', TchatRoomController);

  TchatRoomController.$inject = ['$scope', '$state', '$http', 'tchatUser', 'registeredPeers', 'sse'];

  function TchatRoomController($scope, $state, $http, tchatUser, registeredPeers, sse) {
    var vm = this;

    var peer = null;
    vm.user = tchatUser;
    vm.registeredPeerList = [];
    vm.dataConnections = {};

    vm.connectToAction = connectToAction;

    _init();

    ////////////////

    function _init() {
      if(!tchatUser.nickname) {
        $state.go('tchat.nickname');
      } else {
        _initRtcPeerConnection();
        sse.on('list:change', onRegisteredPeerList);
      }
    }

    function _initRtcPeerConnection() {

      $http.get('/serverInformations').success(function(data) {
        /* global Peer:false */
        peer = new Peer({
          host: '/',
          port: data.port
        });

        peer.on('open', onConnectionOpened);
        peer.on('connection', onDataConnection);
      });
    }

    ////////////////

    function onConnectionOpened(id) {
      tchatUser.rtcId = id;
      $scope.$apply(function() {
        vm.user = tchatUser;
      });

      $http
        .put('/tchat/register/' + tchatUser.nickname + '/' + tchatUser.rtcId + '/' + sse.id)
        .success(function(data, status, headers, config) {
        });

    }

    function onRegisteredPeerList(data) {
      delete data[tchatUser.rtcId];
      $scope.$apply(function() {
        registeredPeers.setList(data);
        vm.registeredPeerList = data;
      });
    }

    function onDataConnection(dataConnection) {
      console.log('a new dataConnection has been established', dataConnection);

      $scope.$apply(function() {
        vm.dataConnections[dataConnection.id] = dataConnection;
      });

    }

    ////////////////

    function connectToAction(rtcId) {
      var dataConnection = peer.connect(rtcId);

      dataConnection.on('open', function() {
        onDataConnection(dataConnection);
      });
    }
  }

})();
