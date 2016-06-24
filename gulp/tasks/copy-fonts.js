(function() {
  'use strict';


  exports.task = function() {
    var fontFiles = config.client.fontFiles;
    var outputDir = config.outputDir + config.clientDir;

    return gulp
      .src(fontFiles)
      .pipe(plug.newer(outputDir))
      .pipe(gulp.dest(outputDir));
  };

})();
