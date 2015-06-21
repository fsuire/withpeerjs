(function() {
  'use strict';

  angular
    .module('app.tchat')
    .controller('Tchat', TchatController);

  TchatController.$inject = ['$scope', '$window', '$sce', 'io', 'navigator', 'logger', 'rtcUp'];

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
  function TchatController($scope, $window, $sce, io, navigator, logger, rtcUp) {
    var vm = this;

    var _upConnection               = null;
    var _downConnection             = null;
    var _upConnectionChannel        = null;

    vm.nickname    = null;
    vm.message     = null;
    vm.messageList = [];
    vm.video       = null;

    vm.sendMessageAction = sendMessageAction;
    vm.sendOfferAction   = sendOfferAction;

    _init();

    ////////////////

    function _init() {
      // io.on('chat:message', getMessageListAction);
      io.on('rtc:offer', _rtcOfferReceived);
      io.on('rtc:candidate', _rtcCandidateReceived);

      _initVideoAsLocalMediaStream();

      _initLocalRtcPeerConnection();
      rtcUp.initialize();
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

      _downConnection      = new $window.RTCPeerConnection({ iceServers: [] });

      _downConnection.createDataChannel('sendDataChannel');

      _downConnection.ondatachannel  = _onDataChannel;
    }

    function _handleFailure(step) {
      return function(err) {
        console.error('error ' + step + ': ', err);
      };
    }

    function _createAnswer() {
      _downConnection.createAnswer(
        function(description) {
          console.log('peer B successfully created answer');
          _downConnection.setLocalDescription(
            description,
            _sendAnswer(description),
            _handleFailure('setting local description of _downConnection')
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
      offer = new $window.RTCSessionDescription(offer);
      _downConnection.setRemoteDescription(
        offer,
        _createAnswer,
        _handleFailure('_rtcOfferReceived()')
      );
    }

    function _rtcCandidateReceived(candidate) {
      candidate = new $window.RTCIceCandidate(candidate);
      _downConnection.addIceCandidate(candidate);
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

      rtcUp.send(JSON.stringify(data));
      // _appendMessage(data);


    }

    function sendOfferAction() {
      rtcUp.createOffer();
    }
  }
})();
