(function() {
  'use strict';

  angular
    .module('app.webrtc')
    .run(configureStates);

  configureStates.$inject = ['routerHelper'];

  /**
   * @function
   * @memberOf app.webrtc
   * @name configureStates
   *
   * @description
   * Configure the webrtc states.
   *
   * @param {object} routerHelper - {@link blocks.router.routerHelper The `routerHelper` service}
   */
  function configureStates(routerHelper) {
    routerHelper.addStates(_getStates(), '/webrtc');
  }

  function _getStates() {
    return [
      {
        state: 'webrtc',
        config: {
          url: '/webrtc',
          templateUrl: 'app/webrtc/webrtc.html',
          controller: 'Webrtc',
          controllerAs: 'vm',
          data: {
            pageTitle: 'WebRTC'
          }
        }
      }
    ];
  }
})();
