'use strict';

module.exports = {
  server: {
    jsFiles: [
      'src/server/**/*.js',
      '!src/server/**/*.spec.js',
      '!src/server/specs/bootstrap.js'
    ],
    jsDevFiles: [
      'src/server/specs/bootstrap.js',
      'src/server/**/*.spec.js'
    ]
  },
  client: {
    cssFiles: [
      'src/client/**/*.css'
    ],
    stylusFiles: [
      'src/client/app/**/*.styl'
    ],
    htmlFiles: [
      'src/client/**/*.html'
    ],
    indexHtmlFile: 'src/client/index.html',
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
    scriptDir: 'client/assets/scripts/',
    templateFiles: [
      'src/client/app/**/*.html'
    ]
  },
  clientDir: 'client/',
  outputDir: 'dist/',
  reportsDir: 'reports/',
  serverDir: 'server/',
  sourceDir: 'src/'
};
