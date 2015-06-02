'use strict';

exports.task = function(done) {
  return gulp
    .src(config.server.jsFiles)
    .pipe(plug.newer(config.outputDir))
    .pipe(gulp.dest(config.outputDir));
};
