(function() {
  'use strict';

  angular
    .module('app.tchat')
    .controller('TchatRoom', TchatRoomController);

  TchatRoomController.$inject = ['$scope', '$state', '$http', 'tchatUser', 'sse'];

  function TchatRoomController($scope, $state, $http, tchatUser, sse) {
    var vm = this;

    var peer = null;
    var registeredConnections = [];
    vm.user = tchatUser;
    vm.registeredPeerList = [];


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
      /* global Peer:false */
      peer = new Peer({
        host: '/',
        port: 3000
      });

      peer.on('open', onConnectionOpened);
      peer.on('connection', onDataConnection);

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
          console.log('registered successfully on tchat');
        });

    }

    function onRegisteredPeerList(data) {
      console.log('onRegisteredPeerList', data);
      delete data[tchatUser.rtcId];
      console.log('--->', data, tchatUser.rtcId);
      $scope.$apply(function() {
        vm.registeredPeerList = data;
      });
    }

    function onDataConnection(dataConnection) {
      console.log('a new dataConnection has been established', dataConnection);

      dataConnection.on('data', function(data) {
        console.log(data);
      });
    }

    ////////////////

    function connectToAction(rtcId) {
      var connection = peer.connect(rtcId);
    }
  }
})();
