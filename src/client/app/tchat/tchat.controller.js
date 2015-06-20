(function() {
  'use strict';

  angular
    .module('app.tchat')
    .controller('Tchat', TchatController);

  TchatController.$inject = ['$scope', '$window', '$sce', 'io', 'navigator', 'logger'];

  /**
   * @ngdoc Controller
   * @memberOf app.tchat
   * @name Tchat
   *
   * @description
   * The Tchat controller
   *
   * @param {object} $scope    - The angular `$scope` service
   * @param {object} $window   - The angular `$window` service
   * @param {object} $sce      - The angular `$sce` service
   * @param {object} io        - {@link blocks.io.io The `io` service}
   * @param {object} navigator - {@link blocks.navigator.navigator The `navigator` service}
   * @param {logger} logger    - {@link blocks.logger.logger The `logger` service}
   *
   * @property {string} nickname   - The user nickname
   * @property {sring} message     - The user message
   * @property {array} messageList - An array of message
   *
   */
  function TchatController($scope, $window, $sce, io, navigator, logger) {
    var vm = this;

    var _peerA            = null;
    var _peerB            = null;
    var _peerAsendChannel = null;

    vm.nickname    = null;
    vm.message     = null;
    vm.messageList = [];
    vm.video       = null;

    vm.sendMessageAction    = sendMessageAction;
    vm.sendOfferAction      = sendOfferAction;

    _init();

    ////////////////

    function _init() {
      io.on('rtc:offer', _rtcOfferReceived);
      io.on('rtc:answer', _rtcAnswerReceived);
      io.on('rtc:candidate', _rtcCandidateReceived);

      _initVideoAsLocalMediaStream();

      _initLocalRtcPeerConnection();
    }

    function _initVideoAsLocalMediaStream() {
      navigator.getUserMedia({
        'video': true
      }, function(localMediaStream) {
        $scope.$apply(function() {
          vm.video = $sce.trustAsResourceUrl($window.URL.createObjectURL(localMediaStream));
        });
      }, function(error) {
        logger.debug('navigator.getUserMedia error: ', error);
      });
    }

    function _initLocalRtcPeerConnection() {
      _peerA            = new $window.RTCPeerConnection({ iceServers: [] });
      _peerAsendChannel = _peerA.createDataChannel('sendDataChannel');

      _peerA.onicecandidate = _sendCandidate;
    }

    function _handleFailure(step) {
      return function(err) {
        console.error('error ' + step + ': ', err);
      };
    }

    function _createOffer(description) {
      console.log('peer A successfully created offer');
      _peerA.setLocalDescription(
        description,
        _sendOffer(description),
        _handleFailure('setting local description of peer A')
      );
    }

    function _createAnswer() {
      _peerB.createAnswer(
        function(description) {
          console.log('peer B successfully created answer');
          _peerB.setLocalDescription(
            description,
            _sendAnswer(description),
            _handleFailure('setting local description of peer B')
          );
        },
        _handleFailure('creating answer')
      );
    }

    function _sendAnswer(description) {
      return function() {
        console.log('sending answer');
        io.emit('rtc:answer', description);
      };
    }

    function _sendOffer(description) {
      return function() {
        console.log('sending offer');
        //io.emit('rtc:offer', description);
      };
    }

    function _sendCandidate(evt) {
      console.log('sending candidate');
      if (evt.candidate) {
        io.emit('rtc:candidate', evt.candidate);
      } else {
        console.log('peer A has finished gathering candidates');
      }
    }

    function _onDataChannel(evt) {
      console.log('on data channel !');
      var receiveChannel = evt.channel;
      receiveChannel.onmessage = _messageReceived;

      function _messageReceived(evt) {
        console.log('message !', evt.data);
        var message = JSON.parse(evt.data);
        _appendMessage(message);
      }
    }

    function _rtcOfferReceived(offer) {
      console.log('offer received');

      offer  = new $window.RTCSessionDescription(offer);
      _peerB = new $window.RTCPeerConnection({ iceServers: [] });

      _peerB.createDataChannel('sendDataChannel');
      _peerB.ondatachannel = _onDataChannel;

      _peerB.setRemoteDescription(
        offer,
        _createAnswer,
        _handleFailure('setting remote description of peer B')
      );
    }

    function _rtcAnswerReceived(answer) {
      logger.debug('answer received');
      answer = new $window.RTCSessionDescription(answer);
      _peerA.setRemoteDescription(
        answer,
        function() {
          console.log('signaling completed between peers');
        },
        _handleFailure('setting remote description of peer A')
      );
    }

    function _rtcCandidateReceived(candidate) {
      candidate = new $window.RTCIceCandidate(candidate);
      _peerB.addIceCandidate(candidate);
    }

    /**
     * @function
     * @name _appendMessage
     * @memberOf app.tchat.Tchat
     *
     * @param {object} data - A message to push in the message list
     */
    function _appendMessage(data) {
      logger.debug('TchatController::appendMessage()', data);

      $scope.$apply(function() {
        vm.messageList.push(data);
      });

      logger.debug('TchatController.messageList', vm.messageList);
    }

    ////////////////

    /**
     * @function
     * @name sendMessageAction
     * @memberOf app.tchat.Tchat
     */
    function sendMessageAction() {
      var data = {
        nickname: vm.nickname,
        message: vm.message
      };

      _peerAsendChannel.send(JSON.stringify(data));
      // _appendMessage(data);

      logger.debug('TchatController::sendMessage()', data);
    }

    function sendOfferAction() {
      _peerA.createOffer(_createOffer, _handleFailure('creating offer'));
    }
  }
})();
