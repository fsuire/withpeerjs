(function() {
  'use strict';

  angular
    .module('blocks.peer')
    .filter('peerNickname', peerNicknameFilter);

  peerNicknameFilter.$inject = ['peer', 'peerConnections'];


  function peerNicknameFilter(peer, peerConnections) {

    return function(rtcId) {
      var nickname = peerConnections.getNicknameFromRtcId(rtcId);

      if(!nickname && peer.user.rtcId == rtcId) {
        nickname = peer.user.nickname;
      }

      return nickname;
    };

  }
})();
