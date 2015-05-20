(function() {
  'use strict';

  angular
    .module('app.webrtc')
    .directive('webRtc', webRtcDirective);

  webRtcDirective.$inject = ['$document'];


  function webRtcDirective($document) {
    return {
      restrict: 'E',
      templateUrl: 'app/webrtc/webrtc.directive.html',
      link: link
    };

    function link(scope, $element) {
      var socket = io();
      socket.on('chat:message', messageReceived);

      var vm = {};

      vm.message = null;
      vm.sendMessageAction = sendMessageAction;

      scope.webrtc = vm;
      var element = $element[0];
      var tchatBoardElement = element.querySelector('.tchat-messages');
      var $tchatBoardElement = angular.element(tchatBoardElement);

      ////////////////////

      function sendMessageAction() {
        socket.emit('chat:message', vm.message);
        console.log('message send :', vm.message);
        vm.message = null;
      }

      function messageReceived(message) {
        console.log('message received :', message);
        $tchatBoardElement.append('<p>' + message + '</p>');
        // console.log($tchatBoardElement);
      }
    }

  }


})();
