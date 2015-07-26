(function() {
  'use strict';

  angular
    .module('blocks.layout')
    .filter('objectLength', objectLengthFilter);

  objectLengthFilter.$inject = [];


  function objectLengthFilter() {

    return function(obj) {
      return Object.keys(obj).length;
    };

  }
})();
