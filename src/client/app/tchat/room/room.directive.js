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
      var _element = element[0];
      var _closeButton = _element.querySelector('button.icon-close');
      var _sendButton = _element.querySelector('button.icon-mail-dark');
      var _connection = scope.connection;
      var _inputElt = _element.querySelector('input.message');
      var _displayZone = _element.querySelector('.message-list');
      var _lastSpeakerId = null;
      var _lastMessageZoneElement = null;

      _sendButton.addEventListener('click', send);
      _inputElt.addEventListener('keyup', function(event) {
        if(event.keyCode === 13) {
          send();
        }
      });
      _closeButton.addEventListener('click', function() {
        _connection.close();
        closeRoom();
      });
      _connection.on('data', onData);
      _connection.on('close', closeRoom);

      scope.nickname = registeredPeers.getNicknameFromRtcId(_connection.peer);

      ////////////////

      function onData(data) {
        var nickname = registeredPeers.getNicknameFromRtcId(_connection.peer);
        appendMessage(_connection.peer, nickname, data);
      }

      function send() {
        var message = _inputElt.value;
        if(message !== '') {

          appendMessage(tchatUser.rtcId, tchatUser.nickname, message, true);
          _connection.send(message);
          _inputElt.value = '';
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
          _displayZone.appendChild(messageElement);

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

    }

  }

})();
