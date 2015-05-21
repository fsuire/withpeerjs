exports.task = function() {
  return gulp
    .src(config.files.server)
    .pipe(plugins.newer(config.outputDir + 'server/'))
    .pipe(gulp.dest(config.outputDir + 'server/'));
};
