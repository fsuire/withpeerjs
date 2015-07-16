(function() {
  'use strict';

  angular
    .module('blocks.peer')
    .factory('PeerRoom', peerRoomFactory);

  peerRoomFactory.$inject = ['Pubsub'];


  function peerRoomFactory(Pubsub) {

    var Room = function() {

      this._dataconnections = {};

    };

    return Room;

    ////////////////


  }
})();
