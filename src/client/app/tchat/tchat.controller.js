(function() {
  'use strict';

  angular
    .module('app.tchat')
    .controller('Tchat', TchatController);

  TchatController.$inject = ['primus', 'logger'];

  /**
   * @ngdoc Controller
   * @memberOf app.tchat
   * @name Tchat
   *
   * @description
   * The Tchat controller
   *
   * @param {object} Primus - The `primus` service
   * @param {logger} logger - {@link blocks.logger.logger The `logger` service}
   */
  function TchatController(primus, logger) {
    var vm = this;

    vm.message = null;
    vm.messageList = [];

    vm.sendMessageAction = sendMessageAction;
    vm.getMessageListAction = getMessageListAction;

    _init();

    ////////////////////

    function _init() {
      primus.$on('tchat-send-message', getMessageListAction);
    }

    /**
     * @function
     * @name sendMessageAction
     * @memberOf app.tchat.Tchat
     */
    function sendMessageAction() {
      var data = { message: vm.message };

      primus.send('tchat-send-message', data);

      logger.debug('TchatController::sendMessage()', data);
    }

    /**
     * @function
     * @name getMessageListAction
     * @memberOf app.tchat.Tchat
     */
    function getMessageListAction(data) {
      logger.debug('TchatController::getMessageList()', data);

      vm.messageList.push(data.message);

      logger.debug('TchatController.messageList', vm.messageList);
    }
  }
})();
