(function() {
  'use strict';

  angular
    .module('blocks.uid')
    .factory('uid', uidFactory);


  /**
   * @ngdoc Factory
   * @memberOf blocks.uid
   * @name uidFactory
   *
   * @description
   * Returns
   *
   * @returns {function} -
   */
  function uidFactory() {
    var _lastUid = 0;

    return function() {
      _lastUid++;
      return _lastUid;
    };
  }
})();
