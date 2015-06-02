(function() {
  'use strict';

  // Copy client code from src to the outputDir

  var path = require('path');

  exports.task = function() {
    var clientFiles = config.client.cssFiles
      .concat(config.client.htmlFiles)
      .concat(config.client.jsFiles);
    var outputDir = path.join(config.outputDir, config.clientDir);

    return gulp
      .src(clientFiles)
      .pipe(plug.newer(outputDir))
      .pipe(gulp.dest(outputDir));
  };

})();
