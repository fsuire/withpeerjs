(function() {
  'use strict';

  // Copy server code from src to the outputDir

  exports.task = function(done) {
    var serverFiles = config.server.jsFiles;

    return gulp
      .src(serverFiles)
      .pipe(plug.newer(config.outputDir))
      .pipe(gulp.dest(config.outputDir));
  };

})();
