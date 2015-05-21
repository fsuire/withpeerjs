(function() {
  'use strict';

  angular
    .module('blocks.io')
    .factory('io', ioFactory);

  /**
   * @ngdoc Factory
   * @memberOf blocks.io
   * @name ioFactory
   *
   * @description
   * Returns an instance of {@link blocks.io.io the `io` service}.
   *
   * @returns {object} - {@link blocks.io.io The `io` service}
   */
  function ioFactory() {
    /**
     * @ngdoc Service
     * @memberOf blocks.io
     * @name io
     *
     * @description
     * The `io` service.
     */
    /* global io:false */
    return io();
  }
})();
