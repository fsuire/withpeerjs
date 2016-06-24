(function() {
  'use strict';

  angular
    .module('blocks.layout')
    .filter('objectKeys', objectKeysFilter);

  objectKeysFilter.$inject = [];


  function objectKeysFilter() {

    return function(obj) {
      return Object.keys(obj);
    };

  }
})();
