(function() {
  'use strict';

  angular
    .module('app.tchat')
    .run(configureStates);

  configureStates.$inject = ['routerHelper'];

  /**
   * @function
   * @memberOf app.tchat
   * @name configureStates
   *
   * @description
   * Configure the tchat states.
   *
   * @param {object} routerHelper - {@link blocks.router.routerHelper The `routerHelper` service}
   */
  function configureStates(routerHelper) {
    routerHelper.addStates(_getStates(), '/tchat');
  }

  function _getStates() {
    return [
      {
        state: 'tchat',
        config: {
          url: '/tchat',
          templateUrl: 'app/tchat/tchat.html',
          controller: 'Tchat',
          controllerAs: 'vm',
          data: {
            pageTitle: 'Tchat'
          }
        }
      }
    ];
  }
})();
