(function() {
  'use strict';

  // Copy server code from src to the outputDir

  var path = require('path');

  exports.task = function() {
    var serverFiles = config.server.jsFiles;
    var outputDir = config.outputDir + config.serverDir;

    return gulp
      .src(serverFiles)
      .pipe(plug.newer(outputDir))
      .pipe(gulp.dest(outputDir));
  };

})();
