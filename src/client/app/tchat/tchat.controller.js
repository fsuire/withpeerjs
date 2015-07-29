(function() {
  'use strict';

  angular
    .module('app.tchat')
    .controller('TchatController', TchatRoomController);

  TchatRoomController.$inject = [
    '$scope', '$state', '$http',
    'peerConnections', 'sse', 'uid', 'peer', 'PeerRoom', 'Pubsub', 'peerRoomCollection'
  ];

  function TchatRoomController(
    $scope, $state, $http,
    peerConnections, sse, uid, peer, PeerRoom, Pubsub, peerRoomCollection
  ) {
    var vm = this;

    vm.registeredPeerList = [];
    vm.user = peer.user;
    vm.roomIdList = peerRoomCollection.getIdList();
    vm.date = null;

    vm.createPublicRoomAction = createPublicRoomAction;


    var _subscribersToDestroy = [];
    _subscribersToDestroy.concat([
      peerConnections.subscribe('list', onpeerlist),
      peerRoomCollection.subscribe('closeroom', _refresh)
    ]);

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
        peer.addChannel('tchat-room/create/public-room', createRoom);
      }
    }

    function _refresh() {
      $scope.$apply(function() {
        vm.roomIdList = peerRoomCollection.getIdList();
      });
    }

    ////////////////

    function createPublicRoomAction() {
      var id = peer.user.rtcId + '-' + uid();
      var room = new PeerRoom({
        name: 'public room',
        type: 'public',
        id: id,
        peers: [peer.user.rtcId]
      });

      peerRoomCollection.addRoom(room);
      vm.roomIdList = peerRoomCollection.getIdList();
    }


    ////////////////

    function createRoom(options) {
      console.log('Room creation order received', options);
      var room = new PeerRoom(options);

      peerRoomCollection.addRoom(room);
      _refresh();
    }

    ////////////////

    function onpeerlist(peerList) {
      $scope.$apply(function() {
        vm.registeredPeerList = peerList;
      });
    }

  }

})();
