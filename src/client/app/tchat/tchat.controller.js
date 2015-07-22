(function() {
  'use strict';

  angular
    .module('app.tchat')
    .controller('TchatController', TchatRoomController);

  TchatRoomController.$inject = ['$scope', '$state', '$http', 'peerConnections', 'sse', 'uid', 'peer', 'PeerRoom', 'Pubsub', 'peerRoomCollection'];

  function TchatRoomController($scope, $state, $http, peerConnections, sse, uid, peer, PeerRoom, Pubsub, peerRoomCollection) {
    var vm = this;

    vm.registeredPeerList = [];
    vm.user = peer.user;
    vm.roomIdList = peerRoomCollection.getIdList();

    vm.createPublicRoomAction = createPublicRoomAction;

    var _subscribersToDestroy = [];
    _subscribersToDestroy.push(
      peerConnections.subscribe('list', onpeerlist)
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

    function createPublicRoomAction() {
      var id = peer.user.rtcId + '-' + uid();
      var room = new PeerRoom({
        name: 'public room',
        type: 'public',
        id: id,
        peers: [peer.user.rtcId],
        onclose: oncloseroom
      });

      peerRoomCollection.addRoom(room);
      vm.roomIdList = peerRoomCollection.getIdList();
    }

    ////////////////

    function createPublicRoom(roomOptions) {
      roomOptions.onclose = oncloseroom;
      var room = new PeerRoom(roomOptions);
      peerRoomCollection.addRoom(room);
      vm.roomIdList = peerRoomCollection.getIdList();
    }

    ////////////////

    function onpeerlist(peerList) {
      $scope.$apply(function() {
        vm.registeredPeerList = peerList;
      });
    }

    function oncloseroom(id) {
      // $scope.$apply(function() {
      //   delete vm.roomCollections[id];
      // });
      peerRoomCollection.removeRoom(id);
      vm.roomIdList = peerRoomCollection.getIdList();
    }

  }

})();
