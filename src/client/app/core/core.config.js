(function() {
  'use strict';

  angular
    .module('app.core')
    .config(configureRouter)
    .config(configurePrimus);

  configureRouter.$inject = ['$locationProvider', 'routerHelperProvider'];

  /**
   * @function
   * @memberOf app.core
   * @name configureRouter
   *
   * @description
   * Configure the router.
   *
   * @param {object} $locationProvider - The angular `$location` provider
   * @param {object} routerHelperProvider - {@link blocks.router.routerHelperProvider The `routerHelper` provider}
   */
  function configureRouter($locationProvider, routerHelperProvider) {
    $locationProvider.html5Mode(true);

    routerHelperProvider.configure({
      pageTitle: 'F8C-Q7N - Tchat'
    });
  }

  configurePrimus.$inject = ['primusProvider'];

  /**
   * @function
   * @memberOf app.core
   * @name configurePrimus
   *
   * @description
   * Configure Primus.
   *
   * @param {object} primusProvider - The `primus` provider
   */
  function configurePrimus(primusProvider) {
    primusProvider
      .setEndpoint('http://127.0.0.1:3000')
      .setOptions({
        reconnect: {
          minDelay: 100,
          maxDelay: 60000,
          retries: 100
        }
      })
      .setDefaultMultiplex(true);
  }
})();
