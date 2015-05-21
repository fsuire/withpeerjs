exports.task = function() {
  return gulp
    .src(config.files.client)
    .pipe(plugins.newer(config.outputDir + 'client/'))
    .pipe(gulp.dest(config.outputDir + 'client/'));
};
