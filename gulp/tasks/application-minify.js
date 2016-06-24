(function() {
  'use strict';

  // Bundle and minify application files (js and css)

  var browserSync = require('browser-sync');

  var utils = require('../utils');

  exports.task = function() {
    return plug.merge(
      gulp
        .src(config.client.cssFiles)
        .pipe(plug.concat('application.min.css'))
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
        .src(config.client.jsFiles)
        .pipe(plug.angularFilesort())
        .pipe(plug.concat('application.min.js'))
        .pipe(plug.bytediff.start())
        .pipe(plug.uglify())
        .pipe(plug.bytediff.stop(utils.bytediffFormatter))
        .pipe(gulp.dest(config.outputDir + config.client.scriptDir))
        .pipe(plug.if(
            IS_SYNC,
            browserSync.reload({ stream: true })
          )
        ),
      gulp
        .src(config.client.templateFiles)
        .pipe(plug.minifyHtml())
        .pipe(plug.angularTemplatecache('templatecache.js', {
          module: 'app.core',
          standalone: false,
          root: 'app'
        }))
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

      /*gulp
        .src(config.client.fontFiles)
        .pipe(plug.newer(config.outputDir + config.clientDir))
        .pipe(gulp.dest(config.outputDir + config.clientDir))
        .pipe(plug.if(
            IS_SYNC,
            browserSync.reload({ stream: true })
          )
        )*/
