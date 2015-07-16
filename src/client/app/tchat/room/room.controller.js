(function() {
  'use strict';

  angular
    .module('app.tchat')
    .controller('TchatRoomController', TchatRoomController);

  TchatRoomController.$inject = ['$scope', '$state', '$http', 'peerConnections', 'sse', 'uid', 'peer', 'Pubsub'];

  function TchatRoomController($scope, $state, $http, peerConnections, sse, uid, peer, Pubsub) {
    var vm = this;

    vm.registeredPeerList = [];
    vm.roomCollections = {};
    vm.user = peer.user;

    vm.createPublicRoomAction = createPublicRoomAction;

    var _subscribersToDestroy = [];
    _subscribersToDestroy.push(
      peerConnections.subscribe('list', onPeerList)
    );

    peer.addChannel('tchat-room/create/public-room', createPublicRoom);

    $scope.$on('$destroy', function() {
      while(_subscribersToDestroy.length) {
        _subscribersToDestroy.pop()();
      }
    });

    _init();

    ////////////////

    function _init() {
      if(!peer.user.nickname) {
        $state.go('tchat.nickname');
      } else {
        peer.connectToServer();
      }
    }

    ////////////////

    function onPeerList(peerList) {
      $scope.$apply(function() {
        vm.registeredPeerList = peerList;
      });
    }

    ////////////////

    function createPublicRoomAction() {
      var id = peer.user.rtcId + '-' + uid();
      var room = {
        name: 'public room',
        type: 'public',
        id: id,
        peers: [peer.user.rtcId]
      };

      vm.roomCollections[id] = room;
    }

    ////////////////

    function createPublicRoom(room) {
      $scope.$apply(function() {
        vm.roomCollections[room.id] = room;
      });
    }


    /*var peer = null;

    vm.user = tchatUser;
    vm.registeredPeerList = [];
    vm.dataConnections = {};

    vm.roomCollections = {};

    vm.createPublicRoomAction = createPublicRoom;

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
        peer = new Peer({
          host: '/',
          port: data.peerjs.port
        });

        peer.on('open', onConnectionOpened);
        peer.on('connection', onDataConnection);
      });
    }

    function _createNewDataConnection(rtcId, roomName) {
      var dataConnection = peer.connect(rtcId, {
        metadata: {
          roomName: roomName
        }
      });

      dataConnection.on('open', function() {
        onDataConnection(dataConnection);
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
      registeredPeers.setList(data);
      $scope.$apply(function() {
        vm.registeredPeerList = data;
      });
    }

    function onDataConnection(dataConnection) {
      //$scope.$apply(function() {
      //  vm.dataConnections[dataConnection.id] = dataConnection;
      //});
    }

    function createPublicRoom() {
      var id = uid();
      var roomId = tchatUser.rtcId + '-' + id;
      var room = {
        name: 'public room ' + id
      };
      //$scope.$apply(function() {
      //  vm.roomCollections[roomId] = room;
      //});

      vm.roomCollections[roomId] = room;
    }*/

  }

})();
