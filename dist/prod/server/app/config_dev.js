(function() {
  'use strict';

  module.exports = {

    ipaddress: '127.0.0.1',
    port: 3000,

    htmlIndexPath: 'dist/dev/client/index.html',
    htmlErrorPath: 'dist/dev/client/error.html',
    primusClientPath: 'dist/dev/client/assets/primus.js',

    staticDirectories: {
      '/bower_components': 'bower_components',
      '/app': 'dist/dev/client/app',
      '/assets': 'dist/dev/client/assets'
    },

    routes: [
      'static.route',
      'index.route',
      'tchat.route',
      'errors.route'
    ]

  };

})();
