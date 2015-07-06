(function() {
  'use strict';

  angular
    .module('app.tchat')
    .run(configureStates);

  configureStates.$inject = ['routerHelper'];

  /**
   * @function
   * @memberOf app.tchat
   * @name configureStates
   *
   * @description
   * Configure the tchat states.
   *
   * @param {object} routerHelper - {@link blocks.router.routerHelper The `routerHelper` service}
   */
  function configureStates(routerHelper) {
    routerHelper.addStates(_getStates(), '/tchat');
  }

  function _getStates() {
    return [
      {
        state: 'tchat',
        config: {
          url: '/tchat',
          abstract: true,
          template: '<ui-view/>'
        }
      },
      {
        state: 'tchat.nickname',
        config: {
          url: '',
          templateUrl: 'app/tchat/nickname/nickname.html',
          controller: 'TchatNickname',
          controllerAs: 'vm',
          data: {
            pageTitle: 'Tchat - nickname, please'
          }
        }
      },
      {
        state: 'tchat.room',
        config: {
          url: '/room',
          templateUrl: 'app/tchat/room/room.html',
          controller: 'TchatRoomController',
          controllerAs: 'vm',
          data: {
            pageTitle: 'Tchat room'
          }
        }
      }
    ];
  }
})();
