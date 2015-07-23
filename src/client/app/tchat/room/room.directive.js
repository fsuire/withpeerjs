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
      //link: link,
      controller: RoomDirectiveController,
      bindToController: true,
      controllerAs: 'tchatRoom'
    };

    function link(scope, element, attrs) {

      console.log('d:', scope);
      //var room = peerRoomCollection.getRoom(attrs.roomId);
      //scope.setRoom(room);

      /*var _element = element[0];
      var _roomNameElement = _element.querySelector('.room-name');
      var _addUserButtonElement = _element.querySelector('button.icon-user-plus');
      var _showConnectedUserButtonElement = _element.querySelector('button.connected-room-user-count');
      var _availableUserListElement = _element.querySelector('.available-user-list');
      var _messageListElement = _element.querySelector('.message-list');
      var _connectedUserListElement = _element.querySelector('.connected-user-list');
      var _closeButtonElement = _element.querySelector('button.icon-close');
      var _sendMessageButtonElement = _element.querySelector('button.icon-mail-dark');
      var _messageInputElement = _element.querySelector('footer input');
      var _lastMessageZoneElement = null;

      var _lastSpeakerId = null;

      _addUserButtonElement.addEventListener('click', showAvailableUserListAction);*/
      // _showConnectedUserButtonElement.addEventListener('click', showConnectedUserListAction);
      // _closeButtonElement.addEventListener('click', closeRoomAction);
      // _sendMessageButtonElement.addEventListener('click', sendMessageAction);
      // _messageInputElement.addEventListener('keyup', function(event) {
      //   if(event.keyCode === 13) {
      //     sendMessageAction();
      //   }
      // });
      //
      // scope.action.addRoomUser = addRoomUserAction;
      //
      // room.onmessage = onmessage;
      // room.onupdate = onroomupdate;
      //
      // _init();
      //
      // ////////////////
      //
      // function _init() {
      //
      //   var joinPromises = [];
      //   angular.forEach(room.peers, function(peerId) {
      //     if(peerId !== peer.user.rtcId) {
      //       joinPromises.push(room.join(peerId));
      //     }
      //   });
      //
      //   $q.all(joinPromises);
      // }
      //
      // ////////////////
      //
      // function showConnectedUserListAction() {
      //   _connectedUserListElement.classList.toggle('shown');
      //   _showConnectedUserButtonElement.classList.toggle('selected');
      // }

      /*function showAvailableUserListAction() {
        _availableUserListElement.classList.toggle('shown');
        _addUserButtonElement.classList.toggle('selected');
      }*/

      // function closeRoomAction() {
      //   room.close();
      // }
      //
      // function addRoomUserAction(peerId) {
      //   room.create(peerId);
      // }
      //
      // function sendMessageAction() {
      //   var message = _messageInputElement.value;
      //   if(message !== '') {
      //     room.sendMessage(message);
      //     appendMessage(peer.user.rtcId, {
      //       message: message,
      //       nickname: peer.user.nickname
      //     }, true);
      //     _messageInputElement.value = '';
      //   }
      // }
      //
      // ////////////////
      //
      // function appendInfo(message) {
      //   _lastSpeakerId = null;
      //
      //   var infoElement = $document[0].createElement('div');
      //   infoElement.classList.add('information');
      //   infoElement.innerHTML = message;
      //   _messageListElement.appendChild(infoElement);
      // }
      //
      // function appendMessage(rtcId, message, isLocallySent) {
      //
      //   if(_lastSpeakerId !== rtcId) {
      //
      //     var messageElement = $document[0].createElement('div');
      //     messageElement.classList.add('message');
      //     messageElement.innerHTML = '<div class="nickname"><span>'
      //       + message.nickname + '</span></div><div class="message"><p>'
      //       + message.message + '<p></div>';
      //     if(isLocallySent) {
      //       messageElement.classList.add('locally-sent');
      //     }
      //     _messageListElement.appendChild(messageElement);
      //
      //     _lastMessageZoneElement = messageElement.querySelector('.message');
      //
      //   } else {
      //
      //     var newMessageElement = $document[0].createElement('p');
      //     var messageText = $document[0].createTextNode(message.message);
      //     newMessageElement.appendChild(messageText);
      //     _lastMessageZoneElement.appendChild(newMessageElement);
      //
      //   }
      //
      //   _lastSpeakerId = rtcId;
      // }
      //
      // function onmessage(message, peerId) {
      //   console.log('message received', message);
      //   switch(message.type) {
      //     case 'message':
      //       appendMessage(peerId, message.value);
      //       break;
      //     case 'connection-information':
      //       appendInfo(message.value);
      //       break;
      //     default:
      //       console.log('Don\'t know what to do with it');
      //       break;
      //   }
      //
      // }
      //
      // function onroomupdate() {
      //   scope.$apply();
      // }

    }

  }

  RoomDirectiveController.$inject = ['$scope', 'peerRoomCollection'];

  function RoomDirectiveController($scope, peerRoomCollection) {
    var tchatRoom = this;

    var _room = peerRoomCollection.getRoom(tchatRoom.id);

    tchatRoom.availableUserListIsShown = false;
    tchatRoom.connectedUserListIsShown = false;
    tchatRoom.peerList = _room.peerList;

    tchatRoom.showAvailableUserListAction = showAvailableUserListAction;
    tchatRoom.showConnectedUserListAction = showConnectedUserListAction;
    tchatRoom.joinAction = joinAction;

    _room.subscribe('peerList', function(peerList) {
      $scope.$apply(function() {
        console.log('peerList update');
        tchatRoom.peerList = peerList;
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
      console.log('ask for joining', peerId);
      _room.join(peerId);
    }

  }

})();
