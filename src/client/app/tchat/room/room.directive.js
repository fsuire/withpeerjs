(function() {
  'use strict';

  angular
    .module('app.tchat')
    .directive('tchatRoom', tchatRoomDirective);

  tchatRoomDirective.$inject = ['tchatUser', 'registeredPeers'];

  function tchatRoomDirective(tchatUser, registeredPeers) {

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
      var $displayZone = null;
      var lastSpeakerNickname = null;

      $displayZone = element.find('section');

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
        appendMessage(nickname, data);
      }

      function send() {
        var message = _inputElt.value;
        if(message !== '') {
          appendMessage(tchatUser.nickname, message, true);
          _connection.send(message);
          _inputElt.value = '';
        }
      }

      function appendMessage(nickname, message, isLocallySent) {
        var messageClass = 'message';
        if(isLocallySent) {
          messageClass += ' locally-sent';
        }
        $displayZone.append(
          '<div class="' + messageClass
          + '"><div class="nickname"><span>'
          + nickname + '</span></div><div class="message">'
          + message + '</div></div>'
        );
      }

      function closeRoom() {

        _element.addEventListener('animationend', function() {
          _element.style.display = 'none';
        });
        _element.classList.add('vanishing');
      }

    }

  }

})();
