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
  }
})();
