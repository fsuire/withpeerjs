(function() {
  'use strict';

  angular
    .module('app.tchat')
    .controller('TchatNickname', TchatNicknameController);

  TchatNicknameController.$inject = ['$state', 'peer'];

  function TchatNicknameController($state, peer) {
    var vm = this;

    vm.nickname = peer.user.nickname;

    vm.validateNicknameAction = validateNicknameAction;
    vm.nicknameKeyupAction = nicknameKeyupAction;

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
