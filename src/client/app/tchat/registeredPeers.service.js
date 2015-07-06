(function() {
  'use strict';

  angular
    .module('app.tchat')
    .factory('registeredPeers', registeredPeersFactory);

  registeredPeersFactory.$inject = ['logger'];


  function registeredPeersFactory(logger) {

    var list = [];

    var service = {
      setList: setList,
      getNicknameFromRtcId: getNicknameFromRtcId
    };

    return service;

    function setList(newList) {
      list = newList;
    }

    function getNicknameFromRtcId(rtcId) {
      var nickname = null;
      if(!angular.isUndefined(list[rtcId])) {
        nickname = list[rtcId].nickname;
      }
      return nickname;
    }

  }
})();
