(function() {
  'use strict';

  angular
    .module('blocks.peer')
    .factory('peerRoomCollection', peerRoomCollectionFactory);

  peerRoomCollectionFactory.$inject = ['Pubsub', 'PeerRoom'];

  /**
   * @ngdoc Factory
   * @memberOf blocks.peer
   * @name peerRoomCollectionFactory
   *
   * @description
   * Returns
   *
   * @returns peerRoomCollection -
   */
  function peerRoomCollectionFactory(Pubsub, PeerRoom) {

    var _collection = {};
    var _subscribers = {};
    var pubsub = new Pubsub();

    var service = {
      addRoom: addRoom,
      createRoom: createRoom,
      removeRoom: removeRoom,
      getRoom: getRoom,
      getIdList: getIdList,

      subscribe: pubsub.subscribe
    };

    return service;

    ////////////////

    function addRoom(peerRoom) {
      var roomId = peerRoom.getId();
      _subscribers[roomId] = [
        peerRoom.subscribe('close', _oncloseroom)
      ];

      _collection[roomId] = peerRoom;
    }

    function createRoom(options) {
      var room = new PeerRoom(options);
      service.addRoom(room);
    }

    function removeRoom(roomId) {
      while(_subscribers[roomId].length) {
        _subscribers[roomId].pop()();
      }
      delete _subscribers[roomId];
      delete _collection[roomId];
    }

    function getIdList() {
      return Object.keys(_collection);
    }

    function getRoom(id) {
      var room = false;
      if(angular.isDefined(_collection[id])) {
        room = _collection[id];
      }
      return room;
    }

    ////////////////

    function _oncloseroom(roomId) {
      pubsub.publish('closeroom', roomId);
      service.removeRoom(roomId);
    }

  }
})();
