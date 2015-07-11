(function() {
  'use strict';

  angular
    .module('app.tchat')
    .controller('TchatNickname', TchatNicknameController);

  TchatNicknameController.$inject = ['$state', 'tchatUser'];

  function TchatNicknameController($state, tchatUser) {
    var vm = this;

    vm.nickname = tchatUser.nickname;

    vm.validateNicknameAction = validateNicknameAction;
    vm.nicknameKeyupAction = nicknameKeyupAction;

    ////////////////

    function validateNicknameAction() {
      tchatUser.nickname = vm.nickname;
      $state.go('tchat.room');
    }

    function nicknameKeyupAction(event) {
      if(event.keyCode === 13) {
        validateNicknameAction();
      }
    }

  }


})();
