exports.task = function(done) {
  var options = {};

  if (env.version) {
    options.version = env.version;
  } else {
    options.type = env.type;
  }

  return gulp
    .src([root + '/bower.json', root + '/package.json'])
    .pipe(plugins.bump(options))
    .pipe(gulp.dest(root));
};
