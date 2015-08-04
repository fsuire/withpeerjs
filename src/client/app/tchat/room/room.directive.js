(function() {
  'use strict';

  angular
    .module('app.tchat')
    .directive('tchatRoom', tchatRoomDirective);

  tchatRoomDirective.$inject = ['$rootScope', '$document', '$q', 'peer', 'peerConnections', 'peerRoomCollection'];

  function tchatRoomDirective($rootScope, $document, $q, peer, peerConnections, peerRoomCollection) {

    return {
      restrict: 'E',
      templateUrl: 'app/tchat/room/room.directive.html',
      scope: {
        id: '='
      },
      controller: RoomDirectiveController,
      bindToController: true,
      controllerAs: 'tchatRoom'
    };

  }

  RoomDirectiveController.$inject = ['$scope', 'peer', 'peerRoomCollection'];

  function RoomDirectiveController($scope, peer, peerRoomCollection) {
    var tchatRoom = this;

    var _room = peerRoomCollection.getRoom(tchatRoom.id);

    tchatRoom.availableUserListIsShown = false;
    tchatRoom.connectedUserListIsShown = false;
    tchatRoom.peerList = _room.peerList;
    tchatRoom.roomUsers = _room.roomUsers;
    tchatRoom.message = '';
    tchatRoom.messages = [];
    tchatRoom.name = _room.name;

    tchatRoom.showAvailableUserListAction = showAvailableUserListAction;
    tchatRoom.showConnectedUserListAction = showConnectedUserListAction;
    tchatRoom.createAction = createAction;
    tchatRoom.joinAction = joinAction;
    tchatRoom.sendMessageAction = sendMessageAction;

    _room.subscribe('peerList', function(peerList) {
      $scope.$apply(function() {
        tchatRoom.peerList = peerList;
      });
    });

    _room.subscribe('roomUsers', function(roomUsers) {
      tchatRoom.roomUsers = roomUsers;
    });

    _room.subscribe('message', function(message) {
      $scope.$apply(function() {
        tchatRoom.messages.push(message);
      });
    });


    ////////////////

    function showAvailableUserListAction() {
      tchatRoom.availableUserListIsShown = !tchatRoom.availableUserListIsShown;
    }

    function showConnectedUserListAction() {
      tchatRoom.connectedUserListIsShown = !tchatRoom.connectedUserListIsShown;
    }

    function joinAction(peerId) {
      _room.join(peerId);
    }

    function createAction(peerId) {
      _room.create(peerId);
    }

    function sendMessageAction() {
      if(tchatRoom.message !== '') {
        var message = _room.sendMessage(tchatRoom.message);
        message.sender = peer.user.rtcId;
        message.locallySent = true;
        tchatRoom.messages.push(message);
        tchatRoom.message = '';
      }
    }

  }

})();
