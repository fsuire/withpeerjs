var config   = require('../config');
var constant = require('../const.js');
var gulp     = require('gulp-help')(require('gulp'));
var plug     = require('gulp-load-plugins')({ lazy: false });

exports.task = function(done) {

  return gulp
    .src(config.server.jsFiles)
    .pipe(
      plug.if(
        constant.IS_DEV,
        plug.newer(config.outputDir + 'server/dev/')
      )
    )
    .pipe(
      plug.if(
        constant.IS_DEV,
        gulp.dest(config.outputDir + 'server/dev/')
      )
    )
    .pipe(
      plug.if(
        constant.IS_PROD,
        plug.newer(config.outputDir + 'server/prod/')
      )
    )
    .pipe(
      plug.if(
        constant.IS_PROD,
        gulp.dest(config.outputDir + 'server/prod/')
      )
    );
};
