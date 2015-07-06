(function() {
  'use strict';

  module.exports = {

    ipaddress: process.env.OPENSHIFT_NODEJS_IP || '127.0.0.1',
    port: process.env.OPENSHIFT_NODEJS_PORT || '3100',

    htmlIndexPath: 'dist/prod/client/index.html',
    htmlErrorPath: 'dist/prod/client/error.html',
//    primusClientPath: 'dist/prod/client/assets/primus.js',
//
//    staticDirectories: {
//      '/bower_components': 'bower_components',
//      '/app': 'dist/prod/client/app',
//      '/assets': 'dist/prod/client/assets'
//    },
//
//    routes: [
//      'static.route',
//      'index.route',
//      'tchat.route',
//      'errors.route'
//    ]

  };

})();
