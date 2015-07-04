(function() {
  'use strict';

  angular
    .module('app.tchat')
    .controller('Tchat', TchatController);

  TchatController.$inject = ['$scope', '$window', '$sce', '$state', 'navigator', 'logger'];

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
   * @param {object} navigator - {@link blocks.navigator.navigator The `navigator` service}
   * @param {logger} logger    - {@link blocks.logger.logger The `logger` service}
   *
   * @property {string} nickname   - The user nickname
   * @property {sring} message     - The user message
   * @property {array} messageList - An array of message
   *
   */
  function TchatController($scope, $window, $sce, $state, navigator, logger) {
    var vm = this;

    console.log($state.get());

    var _downConnection             = null;

    vm.nickname    = null;
    vm.message     = null;
    vm.messageList = [];
    vm.video       = null;

    vm.sendMessageAction = sendMessageAction;
    vm.sendOfferAction   = sendOfferAction;

    _init();

    ////////////////

    function _init() {

    }

    function _initVideoAsLocalMediaStream() {
      navigator.getUserMedia({
        'video': true
      }, function(localMediaStream) {
        $scope.$apply(function() {
          vm.video = $sce.trustAsResourceUrl($window.URL.createObjectURL(localMediaStream));
        });
      }, function(error) {
        logger.debug('navigator.getUserMedia error: ', error);
      });
    }

    /**
     * @function
     * @name _appendMessage
     * @memberOf app.tchat.Tchat
     *
     * @param {object} data - A message to push in the message list
     */
    function _appendMessage(data) {
      logger.debug('TchatController::_appendMessage()', data);

      $scope.$apply(function() {
        vm.messageList.push(data);
      });

      logger.debug('TchatController.messageList', vm.messageList);
    }

    ////////////////

    /**
     * @function
     * @name sendMessageAction
     * @memberOf app.tchat.Tchat
     */
    function sendMessageAction() {


    }

    function sendOfferAction() {

    }
  }
})();
