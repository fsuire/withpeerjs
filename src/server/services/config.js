(function() {
  'use strict';

  module.exports = config;

  config['@singleton'] = true;
  config['@require'] = ['app/config_' + process.env.ENV];

  function config(envconf) {
    return envconf;
  }

})();
