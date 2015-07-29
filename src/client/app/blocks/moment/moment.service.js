(function() {
  'use strict';

  angular
    .module('blocks.moment')
    .factory('moment', momentFactory);

  momentFactory.$inject = [];


  function momentFactory() {
    /* global moment:false */
    moment().locale('fr');
    return moment;

  }

})();
