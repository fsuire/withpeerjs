(function() {
  'use strict';

  angular
    .module('app.tchat')
    .factory('tchatUser', tchatUserFactory);

  tchatUserFactory.$inject = ['logger'];


  function tchatUserFactory(logger) {

    var service = {
      nickname: null,
      rtcId: null
    };

    return service;

  }
})();
