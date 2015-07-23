(function() {
  'use strict';

  angular
    .module('app.tchat')
    .controller('TchatNickname', TchatNicknameController);

  TchatNicknameController.$inject = ['$state', '$element', 'peer'];

  function TchatNicknameController($state, $element, peer) {
    var vm = this;

    vm.nickname = peer.user.nickname;

    vm.validateNicknameAction = validateNicknameAction;
    vm.nicknameKeyupAction = nicknameKeyupAction;

    _init();

    ////////////////

    function _init() {
      $element[0]
        .querySelector('input')
        .focus();
    }

    ////////////////

    function validateNicknameAction() {
      peer.user.nickname = vm.nickname;
      $state.go('tchat.room');
    }

    function nicknameKeyupAction(event) {
      if(event.keyCode === 13) {
        validateNicknameAction();
      }
    }

  }


})();
