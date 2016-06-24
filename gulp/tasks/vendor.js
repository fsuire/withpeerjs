(function() {
  'use strict';

  // Bundle and minify dependencies

  var bowerFiles  = require('bower-files')();
  var browserSync = require('browser-sync');

  var utils = require('../utils');

  exports.task = function() {
    return plug.merge(
      gulp
        .src(bowerFiles.ext('css').files)
        .pipe(plug.concat('vendor.min.css'))
        .pipe(plug.bytediff.start())
        .pipe(plug.minifyCss())
        .pipe(plug.bytediff.stop(utils.bytediffFormatter))
        .pipe(gulp.dest(config.outputDir + config.client.styleDir))
        .pipe(plug.if(
            IS_SYNC,
            browserSync.reload({ stream: true })
          )
        ),
      gulp
        .src(bowerFiles.ext('js').files)
        .pipe(plug.concat('vendor.min.js'))
        .pipe(plug.bytediff.start())
        .pipe(plug.uglify())
        .pipe(plug.bytediff.stop(utils.bytediffFormatter))
        .pipe(gulp.dest(config.outputDir + config.client.scriptDir))
        .pipe(plug.if(
            IS_SYNC,
            browserSync.reload({ stream: true })
          )
        )
      );
  };

})();
