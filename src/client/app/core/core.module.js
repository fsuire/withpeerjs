
(function() {
  'use strict';

  /**
   * @ngdoc Module
   * @name app.core
   *
   * @description
   * The application core module contains all the shared dependencies.
   */
  angular
    .module('app.core', [
      /* Angular modules */
      'ngAnimate',

      /* Cross-app modules */
      'blocks.datepicker',
      'blocks.exception',
      'blocks.navigator',
      'blocks.peer',
      'blocks.pubsub',
      'blocks.layout',
      'blocks.logger',
      'blocks.moment',
      'blocks.router',
      'blocks.sse',
      'blocks.uid'

      /* 3rd-party modules */
    ]);
})();
