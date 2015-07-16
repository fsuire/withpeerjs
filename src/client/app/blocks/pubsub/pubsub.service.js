(function() {
  'use strict';

  angular
    .module('blocks.pubsub')
    .factory('Pubsub', pubsubFactory);

  pubsubFactory.$inject = [];

  /**
   * @ngdoc Factory
   * @memberOf blocks.pubsub
   * @name pubsubFactory
   *
   * @description
   * Returns
   *
   * @returns {function constructor} -
   */
  function pubsubFactory() {

    var _uid = 0;

    var Pubsub = function() {
      this._subscribers = {};
      var _self = this;

      this.publish = function(eventName, publication) {
        if(angular.isDefined(_self._subscribers[eventName])) {
          angular.forEach(_self._subscribers[eventName], function(subscriber) {
            subscriber(publication);
          });
        }
      };

      this.subscribe = function(eventName, subscriber) {
        if(angular.isUndefined(_self._subscribers[eventName])) {
          _self._subscribers[eventName] = {};
        }

        var uid = _getUid();
        _self._subscribers[eventName][uid] = subscriber;
        return _createDestroyFunction(_self, eventName, uid);
      };

    };

    return Pubsub;

    ////////////////

    function _getUid() {
      _uid++;
      return _uid;
    }

    function _createDestroyFunction(publisher, eventName, uid) {
      return function() {
        console.log('destroying subscriber ', eventName, uid);
        delete publisher._subscribers[eventName][uid];
      };
    }

  }
})();
