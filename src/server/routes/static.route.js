(function() {
  'use strict';

  module.exports = staticRoute;

  staticRoute['@singleton'] = true;
  staticRoute['@require'] = ['lodash', 'express', 'services/config'];

  function staticRoute(_, express, config) {

    return function(application) {
      var directories = config.staticDirectories;
      _.forEach(directories, function(value, key) {
        application.use(key, express.static(value));
      });
    };
  }

})();
