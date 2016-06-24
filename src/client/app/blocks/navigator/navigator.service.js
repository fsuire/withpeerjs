(function() {
  'use strict';

  angular
    .module('blocks.navigator')
    .factory('navigator', navigatorFactory);

  /**
   * @ngdoc Factory
   * @memberOf blocks.navigator
   * @name navigatorFactory
   *
   * @description
   * Returns an instance of {@link blocks.navigator.navigator the `navigator` service}.
   *
   * @returns {object} - {@link blocks.navigator.navigator the `navigator` service}
   */
  function navigatorFactory() {
    /**
     * @ngdoc Service
     * @memberOf blocks.navigator
     * @name navigator
     *
     * @description
     * The `navigator` service.
     */
    /* global navigator:false */
    return navigator;
  }
})();
