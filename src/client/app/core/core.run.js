(function() {
  'use strict';

  angular
    .module('app.core')
    .run(runCore);

  runCore.$inject = ['$rootScope'];

  /**
   * @function
   * @memberOf app.core
   * @name runCore
   *
   * @description
   * add utilities to the $rootScope service
   *
   * @param {object} $rootScope    - The angular `$rootScope` service
   */
  function runCore($rootScope) {
    $rootScope.getObjectLength = function(obj) {
      return Object.keys(obj).length;
    };
  }
})();
