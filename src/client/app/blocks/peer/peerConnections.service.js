(function() {
  'use strict';

  angular
    .module('blocks.peer')
    .factory('peerConnections', peerConnectionsFactory);

  peerConnectionsFactory.$inject = [];


  function peerConnectionsFactory() {

    var _list = [];
    var _listeners = {};

    var service = {
      getList: getList,
      setList: setList,
      getNicknameFromRtcId: getNicknameFromRtcId,

      on: on
    };

    return service;

    ////////////////

    function getList() {
      return _list;
    }

    function setList(newList) {
      _list = newList;
      _emit('list', newList);
    }

    function getNicknameFromRtcId(rtcId) {
      var nickname = null;
      if(!angular.isUndefined(_list[rtcId])) {
        nickname = _list[rtcId].nickname;
      }
      return nickname;
    }

    function on(eventName, listener) {
      if(angular.isUndefined(_listeners[eventName])) {
        _listeners[eventName] = [];
      }
      _listeners[eventName].push(listener);
    }

    ////////////////

    function _emit(eventName, data) {
      if(angular.isDefined(_listeners[eventName])) {
        angular.forEach(_listeners[eventName], function(listener) {
          listener(data);
        });
      }
    }



  }
})();
