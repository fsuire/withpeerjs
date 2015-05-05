(function() {
  'use strict';

  var IoC = require('electrolyte');

  var application = function(_, express, config) {

    var app = express();

    _.forEach(config.routes, function(value) {
      IoC.create('routes/' + value)(app);
    });

    return app;

  };

  application['@singleton'] = true;
  application['@require'] = [
    'lodash',
    'express',
    'services/config'
  ];

  module.exports = application;

})();
