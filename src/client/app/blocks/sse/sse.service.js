(function() {
  'use strict';

  angular
    .module('blocks.sse')
    .factory('sse', sseFactory);

  sseFactory.$inject = ['$q'];

  /**
   * @ngdoc Factory
   * @memberOf blocks.sse
   * @name sseFactory
   *
   * @description
   * Returns
   *
   * @returns {object} -
   */
  function sseFactory($q) {
    /* global EventSource:false */
    var es = new EventSource('/sse');

    var events = {};

    var sse = {
      on: on,
      id: null
    };

    es.onmessage = function(event) {
      var data = JSON.parse(event.data);
      var eventname = data.event;

      if(eventname === 'register') {
        sse.id = data.data.sseId;
      } else if(!angular.isUndefined(events[eventname])) {
        for(var i in events[eventname]) {
          events[eventname][i](data.data);
        }
      }

    };

    return sse;

    ////////////////

    function on(event, callback) {
      if(!angular.isArray(events[event])) {
        events[event] = [];
      }
      events[event].push(callback);
    }
  }
})();
