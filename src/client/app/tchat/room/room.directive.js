(function() {
  'use strict';

  angular
    .module('app.tchat')
    .directive('tchatRoom', tchatRoomDirective);

  tchatRoomDirective.$inject = ['$rootScope', '$document', '$q', 'peer', 'peerConnections'];

  function tchatRoomDirective($rootScope, $document, $q, peer, peerConnections) {

    return {
      restrict: 'E',
      templateUrl: 'app/tchat/room/room.directive.html',
      scope: {
        room: '='
      },
      link: link
    };

    function link(scope, element, attrs) {

      var room = scope.room;

      scope.action = {};

      var _element = element[0];
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

      _addUserButtonElement.addEventListener('click', showAvailableUserListAction);
      _showConnectedUserButtonElement.addEventListener('click', showConnectedUserListAction);
      _closeButtonElement.addEventListener('click', closeRoomAction);
      _sendMessageButtonElement.addEventListener('click', sendMessageAction);

      scope.action.addRoomUser = addRoomUserAction;

      room.onmessage = onmessage;
      room.onupdate = onroomupdate;

      _init();

      ////////////////

      function _init() {

        var joinPromises = [];
        angular.forEach(room.peers, function(peerId) {
          if(peerId !== peer.user.rtcId) {
            joinPromises.push(room.join(peerId));
          }
        });

        $q.all(joinPromises);
      }

      ////////////////

      function showConnectedUserListAction() {
        _connectedUserListElement.classList.toggle('shown');
        _showConnectedUserButtonElement.classList.toggle('selected');
      }

      function showAvailableUserListAction() {
        _availableUserListElement.classList.toggle('shown');
        _addUserButtonElement.classList.toggle('selected');
      }

      function closeRoomAction() {
        room.close();
      }

      function addRoomUserAction(peerId) {
        room.create(peerId);
      }

      function sendMessageAction() {
        var message = _messageInputElement.value;
        room.sendMessage(message);
        appendMessage(peer.user.rtcId, peer.user.nickname, message, true);
      }

      ////////////////

      function appendMessage(rtcId, nickname, message, isLocallySent) {

        if(_lastSpeakerId !== rtcId) {

          var messageElement = $document[0].createElement('div');
          messageElement.classList.add('message');
          messageElement.innerHTML = '<div class="nickname"><span>'
            + nickname + '</span></div><div class="message"><p>'
            + message + '<p></div>';
          if(isLocallySent) {
            messageElement.classList.add('locally-sent');
          }
          _messageListElement.appendChild(messageElement);

          _lastMessageZoneElement = messageElement.querySelector('.message');

        } else {

          var newMessageElement = $document[0].createElement('p');
          var messageText = $document[0].createTextNode(message);
          newMessageElement.appendChild(messageText);
          _lastMessageZoneElement.appendChild(newMessageElement);

        }

        _lastSpeakerId = rtcId;
      }

      function onmessage(message, dataconnection) {
        var nickname = peerConnections.getNicknameFromRtcId(dataconnection.peer);
        appendMessage(dataconnection.peer, nickname, message);
      }

      function onroomupdate() {
        scope.$apply();
      }



      /*var _connection = scope.connection;
      var _element = element[0];
      var _roomNameElement = _element.querySelector('.room-name');
      var _closeButtonElement = _element.querySelector('button.icon-close');
      var _sendButtonElement = _element.querySelector('button.icon-mail-dark');
      var _inputMessageElement = _element.querySelector('input.message');
      var _messageListElement = _element.querySelector('.message-list');
      var _oldRoomName = _connection.metadata.roomName;
      var _lastSpeakerId = null;
      var _lastMessageZoneElement = null;


      _roomNameElement.addEventListener('keyup', function(event) {
        if(event.keyCode === 13) {
          _roomNameElement.blur();
          _inputMessageElement.focus();
        }
      });
      _roomNameElement.addEventListener('focus', function() {
        _oldRoomName = _roomNameElement.value;
        _roomNameElement.value = '';
      });
      _roomNameElement.addEventListener('blur', sendNewRoomName);

      _inputMessageElement.addEventListener('keyup', function(event) {
        if(event.keyCode === 13) {
          sendMessage();
        }
      });

      _closeButtonElement.addEventListener('click', function() {
        _connection.close();
        closeRoom();
      });

      _sendButtonElement.addEventListener('click', sendMessage);

      _connection.on('data', onData);
      _connection.on('close', closeRoom);

      scope.roomName = _oldRoomName;

      ////////////////

      function onData(data) {
        data = JSON.parse(data);

        switch(data.type) {
          case 'message':
            var nickname = peerConnections.getNicknameFromRtcId(_connection.peer);
            appendMessage(_connection.peer, nickname, data.value);
            break;
          case 'room-name':
            scope.$apply(function() {
              _oldRoomName = scope.roomName;
              scope.roomName = data.value;
            });
            break;
        }

      }

      function sendMessage() {
        var message = _inputMessageElement.value;
        if(message !== '') {

          appendMessage(tchatUser.rtcId, tchatUser.nickname, message, true);
          _connection.send(JSON.stringify({
            type: 'message',
            value: message
          }));
          _inputMessageElement.value = '';
        }
      }

      function appendMessage(rtcId, nickname, message, isLocallySent) {

        if(_lastSpeakerId !== rtcId) {

          var messageElement = $document[0].createElement('div');
          messageElement.classList.add('message');
          messageElement.innerHTML = '<div class="nickname"><span>'
            + nickname + '</span></div><div class="message"><p>'
            + message + '<p></div>';
          if(isLocallySent) {
            messageElement.classList.add('locally-sent');
          }
          _messageListElement.appendChild(messageElement);

          _lastMessageZoneElement = messageElement.querySelector('.message');

        } else {

          var newMessageElement = $document[0].createElement('p');
          var messageText = $document[0].createTextNode(message);
          newMessageElement.appendChild(messageText);
          _lastMessageZoneElement.appendChild(newMessageElement);

        }

        _lastSpeakerId = rtcId;
      }

      function sendNewRoomName() {
        if(_roomNameElement.value === '') {
          _roomNameElement.value = _oldRoomName;
        } else if(_oldRoomName !== _roomNameElement.value) {
          _oldRoomName = _roomNameElement.value;
          _connection.send(JSON.stringify({
            type: 'room-name',
            value: _oldRoomName
          }));
        }
      }*/

    }

  }

})();
