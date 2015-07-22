(function() {
  'use strict';

  angular
    .module('blocks.peer')
    .factory('peerRoomCollection', peerRoomCollectionFactory);

  peerRoomCollectionFactory.$inject = [];

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
  function peerRoomCollectionFactory() {

    var _collection = {};

    var service = {
      addRoom: addRoom,
      removeRoom: removeRoom,
      getRoom: getRoom,
      getIdList: getIdList
    };

    return service;

    ////////////////

    function addRoom(peerRoom) {
      _collection[peerRoom.getId()] = peerRoom;
    }

    function removeRoom(id) {
      delete _collection[id];
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

  }
})();
