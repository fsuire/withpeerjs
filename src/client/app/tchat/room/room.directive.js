(function() {
  'use strict';

  angular
    .module('app.tchat')
    .directive('tchatRoom', tchatRoomDirective);

  tchatRoomDirective.$inject = ['tchatUser', 'registeredPeers'];

  function tchatRoomDirective(tchatUser, registeredPeers) {

    var $sendButton = null;
    var $input = null;
    var $displayZone = null;
    var connection = null;

    var lastSpeakerNickname = null;

    return {
      restrict: 'E',
      templateUrl: '/app/tchat/room/room.directive.html',
      scope: {
        connection: '='
      },
      link: link
    };

    function link(scope, element, attrs) {
      connection = scope.connection;
      $sendButton = element.find('button');
      $input = element.find('input');
      $displayZone = element.find('section');

      $sendButton.on('click', send);
      connection.on('data', onData);

      scope.nickname = registeredPeers.getNicknameFromRtcId(connection.peer);

    }

    function onData(data) {
      var nickname = registeredPeers.getNicknameFromRtcId(connection.peer);
      appendMessage(nickname, data);
    }

    function send() {
      var message = $input.val();
      if(message !== '') {
        appendMessage(tchatUser.nickname, message, true);
        connection.send(message);
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

  }

})();
