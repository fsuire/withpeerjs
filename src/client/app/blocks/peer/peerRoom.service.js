(function() {
  'use strict';

  angular
    .module('blocks.peer')
    .factory('PeerRoom', peerRoomFactory);

  peerRoomFactory.$inject = ['$q', 'Pubsub', 'peer', 'peerConnections'];


  function peerRoomFactory($q, Pubsub, peer, peerConnections) {

    var Room = function(options) {

      var self = this;

      var _id = options.id;
      var _dataconnections = {};

      this.roomUsers = {};
      this.roomUserList = [];
      this.peerList = peerConnections.getList();
      this.peerIdList = Object.keys(this.peerList);
      this.peers = options.peers || [];
      this.name = options.name || 'Please enter a name';
      this.onmessage = null;

      ////////////////

      peerConnections.subscribe('list', _refreshPeerList);

      peer.addChannel('tchat-room/join/' + _id, function(peerId) {
        console.log('joining room ', _id);
        self.addRoomUser(peerId);
      });

      peer.addChannel('tchat-room/message/' + _id, function(message, dataconnection) {
        console.log('room ' + _id + ' has received a message from ' + dataconnection.peer, message);
        if(angular.isFunction(self.onmessage)) {
          self.onmessage(message, dataconnection);
        }
      });

      ////////////////

      this.addRoomUser = function(peerId) {
        var deferred = $q.defer();
        peer.getDataconnection(peerId).then(function(dataconnection) {

          self.roomUsers[peerId] = self.peerList[peerId];
          self.roomUserList = Object.keys(self.roomUsers);

          _dataconnections[peerId] = dataconnection;
          deferred.resolve(dataconnection);
        });

        return deferred.promise;
      };

      this.create = function(peerId) {
        console.log('send create', peerId);
        return self.addRoomUser(peerId).then(function(dataconnection) {
          dataconnection.send(JSON.stringify({
            channel: 'tchat-room/create/public-room',
            data: {
              name: self.name,
              id: _id,
              peers: [peer.user.rtcId].concat(Object.keys(self.roomUsers))
            }
          }));
        });
      };

      this.join = function(peerId) {
        console.log('send join', peerId);
        return self.addRoomUser(peerId).then(function(dataconnection) {
          dataconnection.send(JSON.stringify({
            channel: 'tchat-room/join/' + _id,
            data: peer.user.rtcId
          }));
        });
      };

      this.sendMessage = function(message) {
        console.log('sending message to', _dataconnections);
        angular.forEach(_dataconnections, function(dataconnection) {
          dataconnection.send(JSON.stringify({
            channel: 'tchat-room/message/' + _id,
            data: message
          }));
        });
      };

      ////////////////

      function _refreshPeerList(userList) {
        console.log('refresh peerList');
        self.peerList = userList;
        self.peerIdList = Object.keys(self.peerList);
      }

    };

    return Room;

  }
})();
