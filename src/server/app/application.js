(function() {
  'use strict';

  module.exports = application;

  application['@singleton'] = true;
  application['@require'] = [
    'electrolyte',
    'lodash',
    'express',
    'services/config'
  ];

  function application(IoC, _, express, config) {

    var app = express();

    _.forEach(config.routes, function(value) {
      IoC.create('routes/' + value)(app);
    });

    return app;

  }

})();
