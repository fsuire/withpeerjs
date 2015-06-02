'use strict';

module.exports = {
  jsFiles: [
    'src/**/*.js',
    '!src/**/*.spec.js'
  ],
  server: {
    jsFiles: [
      'src/server/**/*.js',
      '!src/server/**/*.spec.js'
    ]
  },
  client: {

  },
  outputDir: 'dist/'
};
