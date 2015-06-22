(function() {
  'use strict';

  angular
    .module('blocks.rtc')
    .factory('rtcDown', rtcDownFactory);

  rtcDownFactory.$inject = ['$window', 'io'];

  function rtcDownFactory($window, io) {

    var _connection = null;
    var _channel    = null;

    return {
      initialize: initialize,
      onmessage: onmessage
    };

    ////////////////

    function initialize() {
      io.on('rtc:offer', _rtcOfferReceived);
      io.on('rtc:candidate', _rtcCandidateReceived);

      _connection = new $window.RTCPeerConnection({ iceServers: [] });
      _channel    = _connection.createDataChannel('sendDataChannel');

      _connection.ondatachannel  = _onDataChannel;
    }

    ////////////////

    function onmessage() {
    }

    ////////////////

    function _handleFailure(step) {
      return function(err) {
        console.error('error ' + step + ': ', err);
      };
    }

    function _rtcOfferReceived(offer) {
      console.log('offer received');
      offer = new $window.RTCSessionDescription(offer);
      _connection.setRemoteDescription(
        offer,
        _createAnswer,
        _handleFailure('_rtcOfferReceived()')
      );
    }

    function _createAnswer() {
      _connection.createAnswer(
        function(answer) {
          console.log('rtcDown successfully created answer');
          _connection.setLocalDescription(
            answer,
            _sendAnswer(answer),
            _handleFailure('setting local description of rtcDown')
          );
        },
        _handleFailure('creating answer')
      );
    }

    function _sendAnswer(answer) {
      return function() {
        console.log('sending answer');
        io.emit('rtc:answer', answer);
      };
    }

    function _rtcCandidateReceived(candidate) {
      candidate = new $window.RTCIceCandidate(candidate);
      _connection.addIceCandidate(candidate);
    }

    function _onDataChannel(evt) {
      console.log('rtcDown : peer connection made');
      var receiveChannel = evt.channel;
      receiveChannel.onmessage = _messageReceived;

      function _messageReceived(evt) {
        console.log('message received :', evt.data);
        var message = JSON.parse(evt.data);
        onmessage(message);
      }
    }



  }
})();
