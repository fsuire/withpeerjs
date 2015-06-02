'use strict';

module.exports = {
  server: {
    jsFiles: [
      'src/server/**/*.js',
      '!src/server/**/*.spec.js'
    ]
  },
  client: {
    cssFiles: [
      'src/client/**/*.css'
    ],
    htmlFiles: [
      'src/client/error.html',
      'src/client/index.html'
    ],
    jsFiles: [
      'src/client/**/*.module.js',
      'src/client/**/*.js',
      //'!src/client/**/*.mock.js',
      '!src/client/**/*.spec.js'
    ],
    jsDevFiles: [
      //'src/client/**/*.mock.js',
      'src/client/**/*.spec.js'
    ],
    styleDir: 'client/assets/styles/',
    scriptDir: 'client/assets/scripts/'
  },
  clientDir: 'client/',
  outputDir: 'dist/',
  reportsDir: 'reports/',
  serverDir: 'server/'
};
