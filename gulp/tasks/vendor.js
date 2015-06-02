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
        //.pipe(plug.newer(config.outputDir + 'client/assets/styles/vendor.min.css'))
        .pipe(plug.concat('vendor.css'))
        .pipe(gulp.dest(config.outputDir + config.client.styleDir))
        .pipe(plug.rename({suffix: '.min'}))
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
        //.pipe(plug.newer(config.outputDir + 'client/assets/scripts/vendor.min.js'))
        .pipe(plug.concat('vendor.js'))
        .pipe(gulp.dest(config.outputDir + config.client.scriptDir))
        .pipe(plug.rename({suffix: '.min'}))
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
