(function() {
  'use strict';

  angular
    .module('blocks.rtc')
    .factory('rtcUp', rtcUpFactory);

  rtcUpFactory.$inject = ['$window', 'io'];

  function rtcUpFactory($window, io) {

    var _connection = null;
    var _channel    = null;

    return {
      initialize: initialize,
      createOffer: createOffer,
      send: send
    };

    ////////////////

    function initialize() {
      io.on('rtc:answer', _rtcAnswerReceived);

      _connection                 = new $window.RTCPeerConnection({ iceServers: [] });
      _channel                    = _connection.createDataChannel('sendDataChannel');

      _connection.ondatachannel  = function() {
        console.log('rtcUp : ondatachannel has been called, it should not happen ?!');
      };
      _connection.onicecandidate  = _sendCandidate;
      _connection.oniceconnectionstatechange  = function(evt) {
        console.log('rtcUp, oniceconnectionstatechange :', evt);
      };
      _connection.onidentityresult  = function(evt) {
        console.log('rtcUp, onidentityresult :', evt.assertion);
      };
      _connection.onidpassertionerror  = function(evt) {
        console.log('rtcUp, onidpassertionerror :', evt);
      };
      _connection.onidpvalidationerror  = function(evt) {
        console.log('rtcUp, onidpvalidationerror :', evt);
      };
      _connection.onnegotiationneeded  = function(evt) {
        console.log('rtcUp, onnegotiationneeded :', evt);
      };
      _connection.onpeeridentity  = function(evt) {
        console.log('rtcUp, onpeeridentity :', evt);
      };
      _connection.onsignalingstatechange  = function(evt) {
        console.log('rtcUp, onsignalingstatechange :', evt);
      };
    }

    function createOffer(description) {
      _connection.createOffer(_createOffer, _handleFailure('creating offer'));

      function _createOffer(description) {
        console.log('rtcUp successfully created offer');
        _connection.setLocalDescription(
          description,
          _sendOffer(description),
          _handleFailure('setting local description of rtcUp')
        );
      }
    }

    function send(data) {
      var message = angular.isString(data) ? data : JSON.stringify(data);
      _channel.send(message);
      console.log('rtcUp::send()', message);
    }

    ////////////////

    function _handleFailure(step) {
      return function(err) {
        console.error('error ' + step + ': ', err);
      };
    }

    function _rtcAnswerReceived(answer) {
      console.log('answer received');
      answer = new $window.RTCSessionDescription(answer);
      _connection.setRemoteDescription(
        answer,
        function() {
          console.log('signaling completed between peers');
        },
        _handleFailure('_rtcAnswerReceived()')
      );
    }

    function _sendCandidate(evt) {
      console.log('sending candidate');
      if (evt.candidate) {
        io.emit('rtc:candidate', evt.candidate);
      } else {
        console.log('rtcUp has finished gathering candidates');
      }
    }

    function _sendOffer(description) {
      return function() {
        console.log('sending offer');
        io.emit('rtc:offer', description);
      };
    }

  }
})();
