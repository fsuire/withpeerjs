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

    };

    Pubsub.prototype = {

      _subscribers: {},

      publish: function(eventName, publication) {
        if(angular.isDefined(this._subscribers[eventName])) {
          angular.forEach(this._subscribers[eventName], function(subscriber) {
            subscriber(publication);
          });
        }
      },

      subscribe: function(eventName, subscriber) {
        if(angular.isUndefined(this._subscribers[eventName])) {
          this._subscribers[eventName] = {};
        }

        var uid = _getUid();
        this._subscribers[eventName][uid] = subscriber;
        return _createDestroyFunction(this, eventName, uid);
      }

    };

    return Pubsub;

    ////////////////

    function _getUid() {
      _uid++;
      return _uid;
    }

    function _createDestroyFunction(publisher, eventName, uid) {
      return function() {
        delete publisher._subscribers[eventName][uid];
      };
    }

  }
})();
