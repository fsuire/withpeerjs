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
      'src/client/**/*.js',
      '!src/client/**/*.spec.js'
    ]
  },
  outputDir: 'dist/'
};
