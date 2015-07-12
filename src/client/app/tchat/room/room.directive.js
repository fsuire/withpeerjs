(function() {
  'use strict';

  angular
    .module('app.tchat')
    .directive('tchatRoom', tchatRoomDirective);

  tchatRoomDirective.$inject = ['$document', 'tchatUser', 'registeredPeers'];

  function tchatRoomDirective($document, tchatUser, registeredPeers) {

    return {
      restrict: 'E',
      templateUrl: 'app/tchat/room/room.directive.html',
      scope: {
        connection: '='
      },
      link: link
    };

    function link(scope, element, attrs) {
      var _connection = scope.connection;
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
            var nickname = registeredPeers.getNicknameFromRtcId(_connection.peer);
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

      function closeRoom() {
        _element.style.display = 'none';
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
      }

    }

  }

})();
