var constant = require('../const.js');
var gulp     = require('gulp-help')(require('gulp'));
var plug     = require('gulp-load-plugins')({ lazy: false });

exports.task = function(done) {

  return gulp
    .src(config.server.jsFiles)
    .pipe(plug.newer(constant.CONF.outputDir))
    .pipe(gulp.dest(constant.CONF.outputDir));
};
