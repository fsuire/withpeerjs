(function() {
  'use strict';

  angular
    .module('blocks.peer')
    .factory('Peer', peerFactory);

  /**
   * @ngdoc Factory
   * @memberOf blocks.peer
   * @name peerFactory
   *
   * @description
   * Returns the Peer constructor
   *
   * @returns {object} - The Peer constructor
   */
  function peerFactory() {
    /* global Peer:false */
    return Peer;
  }
})();
