(function() {
  'use strict';

  angular
    .module('app.webrtc')
    .controller('Webrtc', WebrtcController);

  WebrtcController.$inject = ['logger'];

  /**
   * @ngdoc Controller
   * @memberOf app.webrtc
   * @name Webrtc
   *
   * @description
   * The Webrtc controller
   *
   * @param {logger} logger - {@link blocks.logger.logger The `logger` service}
   */
  function WebrtcController(logger) {
    var vm = this;

    vm.message = null;
    vm.messageList = [];

    vm.sendMessageAction = sendMessageAction;

    var socket = io();

    socket.on('chat:message', messageReceived);

    ////////////////////

    function sendMessageAction() {
      socket.emit('chat:message', vm.message);
      console.log('message send :', vm.message);
      vm.message = null;
    }

    function messageReceived(message) {
      console.log('message received :', message);
      vm.messageList.push(message);
    }

  }
})();
