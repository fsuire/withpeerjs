(function() {
  'use strict';

  angular
    .module('blocks.moment')
    .filter('moment', formatFilter);

  formatFilter.$inject = ['moment'];


  function formatFilter(moment) {

    return function(momentObject, func, param1, param2) {
      var what = null;
      if(momentObject) {
        what = momentObject[func](param1, param2);
      }
      return what;
    };

  }
})();
