(function() {
  'use strict';

  angular
    .module('app.tchat')
    .controller('Tchat', TchatController);

  TchatController.$inject = ['$scope', '$window', '$sce', 'io', 'navigator', 'logger'];

  /**
   * @ngdoc Controller
   * @memberOf app.tchat
   * @name Tchat
   *
   * @description
   * The Tchat controller
   *
   * @param {object} $scope    - The angular `$scope` service
   * @param {object} $window   - The angular `$window` service
   * @param {object} $sce      - The angular `$sce` service
   * @param {object} io        - {@link blocks.io.io The `io` service}
   * @param {object} navigator - {@link blocks.navigator.navigator The `navigator` service}
   * @param {logger} logger    - {@link blocks.logger.logger The `logger` service}
   *
   * @property {string} nickname   - The user nickname
   * @property {sring} message     - The user message
   * @property {array} messageList - An array of message
   *
   */
  function TchatController($scope, $window, $sce, io, navigator, logger) {
    var vm = this;

    vm.nickname    = null;
    vm.message     = null;
    vm.messageList = [];
    vm.video       = null;

    vm.sendMessageAction    = sendMessageAction;
    vm.getMessageListAction = getMessageListAction;

    _init();

    ////////////////

    function _init() {
      navigator.getUserMedia({
        'video': true
      }, function(localMediaStream) {
        $scope.$apply(function() {
          vm.video = $sce.trustAsResourceUrl($window.URL.createObjectURL(localMediaStream));
        });
      }, function(error) {
        logger.debug('navigator.getUserMedia error: ', error);
      });

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
