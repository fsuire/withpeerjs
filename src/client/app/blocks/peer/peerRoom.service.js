(function() {
  'use strict';

  angular
    .module('blocks.peer')
    .factory('PeerRoom', peerRoomFactory);

  peerRoomFactory.$inject = ['$q', 'Pubsub', 'peer', 'peerConnections'];


  function peerRoomFactory($q, Pubsub, peer, peerConnections) {

    var Room = function(options) {
      var pubsub = new Pubsub();
      var self = this;

      var _id = options.id;
      var _dataconnections = {};

      this.roomUsers = {};
      this.roomUserList = [];
      this.peerList = peerConnections.getList();
      this.peerIdList = Object.keys(this.peerList);
      this.name = options.name || 'Please enter a name';
      this.subscribe = pubsub.subscribe;


      ////////////////

      peerConnections.subscribe('list', _refreshPeerList);

      peer.addChannel('tchat-room/join/' + _id, function(message, dataconnection) {
        console.log('JOIN ORDER', message);
        self.addRoomUser(dataconnection.peer);
      });

      peer.addChannel('tchat-room/message/' + _id, function(message, dataconnection) {
        pubsub.publish('message', message);
      });

      peer.addChannel('tchat-room/disconnect/' + _id, function(message, dataconnection) {
        _disconnectUser(dataconnection.peer);
      });

      ////////////////

      this.addRoomUser = function(peerId) {
        var peerString = peerId + ' (' + peerConnections.getNicknameFromRtcId(peerId) + ')';
        var deferred = $q.defer();
        console.log('adding ' + peerString + ' to room ' + _id, peerId);

        if(angular.isUndefined(_dataconnections[peerId])) {
          console.log(peerString + ' is being added to room ' + _id);
          peer.getDataconnection(peerId).then(function(dataconnection) {
            self.roomUsers[peerId] = self.peerList[peerId];
            self.roomUserList = Object.keys(self.roomUsers);
            _dataconnections[peerId] = dataconnection;
            pubsub.publish('roomUsers', self.roomUsers);
            console.log('added ' + peerString + ' to roomUsers', self.roomUsers);

            deferred.resolve(dataconnection);
            console.log(peerString + ' added to room ' + _id);
          }, function(error) {
            console.log(peerString + ' was not added to room ' + _id, error);
          });
        } else {
          deferred.resolve(_dataconnections[peerId]);
        }

        return deferred.promise;
      };

      this.close = function() {
        self.disconnect();
        pubsub.publish('close', _id);
      };

      this.create = function(peerId) {
        return self.addRoomUser(peerId).then(function(dataconnection) {
          console.log('sending room creation order to ' + peerId, [peer.user.rtcId].concat(Object.keys(self.roomUsers)));
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

      this.disconnect = function() {
        angular.forEach(_dataconnections, function(dataconnection) {
          dataconnection.send(JSON.stringify({
            channel: 'tchat-room/disconnect/' + _id,
            data: ''
          }));
        });
      };

      this.getId = function() {
        return _id;
      };

      this.getPeerList = function() {
        return self.peerList;
      };

      this.join = function(peerId) {
        return self.addRoomUser(peerId).then(function(dataconnection) {
          dataconnection.send(JSON.stringify({
            channel: 'tchat-room/join/' + _id,
            data: {
              //peer.user.rtcId
            }
          }));
        });
      };

      this.sendMessage = function(message) {
        console.log('sending message', Object.keys(_dataconnections));
        message = {
          type: 'message',
          value: message
        };

        angular.forEach(_dataconnections, function(dataconnection) {
          dataconnection.send(JSON.stringify({
            channel: 'tchat-room/message/' + _id,
            data: message
          }));
        });

        return message;
      };

      ////////////////

      function _refreshPeerList(userList) {
        self.peerList = userList;
        self.peerIdList = Object.keys(self.peerList);

        var disconnectedUsers = [];
        angular.forEach(self.roomUserList, function(peerId) {
          if(self.peerIdList.indexOf(peerId) === -1) {
            disconnectedUsers.push(peerId);
          }
        });
        angular.forEach(disconnectedUsers, function(peerId) {
          _disconnectUser(peerId);
        });
        pubsub.publish('peerList', self.peerList);
      }

      function _disconnectUser(peerIds) {
        if(!angular.isArray(peerIds)) {
          peerIds = [peerIds];
        }
        angular.forEach(peerIds, function(peerId) {
          if(angular.isFunction(self.onmessage)) {
            self.onmessage({
              type: 'connection-information',
              value: peerConnections.getNicknameFromRtcId(peerId) + ' has been disconnected.'
            });
          }

          delete self.roomUsers[peerId];
          self.roomUserList = Object.keys(self.roomUsers);
          delete _dataconnections[peerId];
          pubsub.publish('roomUsers', self.roomUsers);
        });
      }

      console.log('creating room ' + _id, options.peers + ' (sender: ' + options.sender + ')');

      angular.forEach(options.peers, function(peerId) {
        if(peerId !== peer.user.rtcId) {
          self.join(peerId);
        }
      });

    };

    return Room;

  }
})();
