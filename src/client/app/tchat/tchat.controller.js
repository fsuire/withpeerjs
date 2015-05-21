(function() {
  'use strict';

  angular
    .module('app.tchat')
    .controller('Tchat', TchatController);

  TchatController.$inject = ['$scope', 'io', 'logger'];

  /**
   * @ngdoc Controller
   * @memberOf app.tchat
   * @name Tchat
   *
   * @description
   * The Tchat controller
   *
   * @param {object} io     - {@link blocks.io.io The `io` service}
   * @param {logger} logger - {@link blocks.logger.logger The `logger` service}
   *
   * @property {string} nickname   - The user nickname
   * @property {sring} message     - The user message
   * @property {array} messageList - An array of message
   *
   */
  function TchatController($scope, io, logger) {
    var vm = this;

    vm.nickname    = null;
    vm.message     = null;
    vm.messageList = [];

    vm.sendMessageAction    = sendMessageAction;
    vm.getMessageListAction = getMessageListAction;

    _init();

    ////////////////

    function _init() {
      io.on('chat:message', getMessageListAction);
    }

    /**
     * @function
     * @name sendMessageAction
     * @memberOf app.tchat.Tchat
     */
    function sendMessageAction() {
      var data = {
        nickname: vm.nickname,
        message: vm.message
      };

      io.emit('chat:message', data);

      logger.debug('TchatController::sendMessage()', data);
    }

    /**
     * @function
     * @name getMessageListAction
     * @memberOf app.tchat.Tchat
     *
     * @param {object} data - A message to push in the message list
     */
    function getMessageListAction(data) {
      logger.debug('TchatController::getMessageList()', data);

      $scope.$apply(function() {
        vm.messageList.push(data);
      });

      logger.debug('TchatController.messageList', vm.messageList);
    }
  }
})();
