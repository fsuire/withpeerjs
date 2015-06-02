(function() {
  'use strict';

  // Copy client code from src to the outputDir

  exports.task = function() {
    var clientFiles = config.server.cssFiles
      .concat(config.client.htmlFiles)
      .concat(config.client.jsFiles);

    return gulp
      .src(clientFiles)
      .pipe(plug.newer(config.outputDir))
      .pipe(gulp.dest(config.outputDir));
  };

})();
