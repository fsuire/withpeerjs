(function() {
  'use strict';

  // Build the application

  var runSequence = require('run-sequence');

  exports.dependencies = ['serve'];

  exports.task = function(callback) {

   gulp
      .watch(config.client.stylusFiles, function() {
        runSequence('stylus');
      })
      .on('change', logWatch);

    gulp
      .watch(config.client.cssFiles, function() {
        runSequence('build');
      })
      .on('change', logWatch);

    gulp
      .watch(config.client.jsFiles, function() {
        runSequence('karma', 'build');
      })
      .on('change', logWatch);

    gulp
      .watch(config.client.htmlFiles, function() {
        runSequence('build');
      })
      .on('change', logWatch);

    gulp
      .watch(config.server.jsFiles, function() {
        runSequence('build');
      })
      .on('change', logWatch);

  };

  function logWatch(event) {
    log('File ' + event.path + ' was ' + event.type + ', running tasks...');
  }

})();
