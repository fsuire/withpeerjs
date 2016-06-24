(function() {
  'use strict';

  angular
    .module('blocks.peer')
    .factory('peerConnections', peerConnectionsFactory);

  peerConnectionsFactory.$inject = ['Pubsub'];


  function peerConnectionsFactory(Pubsub) {

    var pubsub = new Pubsub();

    var _list = [];
    var service = {
      getList: getList,
      setList: setList,
      getNicknameFromRtcId: getNicknameFromRtcId,

      subscribe: pubsub.subscribe
    };

    return service;

    ////////////////

    function getList() {
      return _list;
    }

    function setList(newList) {
      _list = newList;
      pubsub.publish('list', newList);
    }

    function getNicknameFromRtcId(rtcId) {
      var nickname = null;
      if(!angular.isUndefined(_list[rtcId])) {
        nickname = _list[rtcId].nickname;
      }
      return nickname;
    }



  }
})();
