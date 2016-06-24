(function() {
  'use strict';

  // Make injection to the index.html dev file

  var bowerFiles  = require('bower-files')();

  exports.task = function() {

    var conf = {
      read: false,
      cwd: config.outputDir + 'client/'
    };

    var cssFiles = 'assets/**/*.css';
    var assetsFiles = 'assets/**/*.js';
    var vendorFiles = bowerFiles.ext('js').files;
    var applicationFiles = ['app/**/*.js', '!app/**/*.old.js'];

    if (!IS_DEV) {
       cssFiles = 'assets/**/*.min.css';
       assetsFiles = 'assets/*.js';
       vendorFiles = ['assets/scripts/vendor.min.js'];
       applicationFiles = ['assets/scripts/application.min.js', 'assets/scripts/templatecache.js'];
    }

    return gulp.src(config.client.indexHtmlFile)

      // Inject assets css
      .pipe(plug.inject(gulp.src(
        cssFiles,
        conf
      ), {name: 'assets'}))

      // Inject assets js
      .pipe(plug.inject(gulp.src(
        assetsFiles,
        conf
      ), {name: 'assets'}))

      // inject bowerfiles js
      .pipe(plug.if(
        IS_DEV,
        plug.inject(gulp.src(
          vendorFiles,
          {read: false}
        ), {name: 'vendor'}
      )))
      .pipe(plug.if(
        !IS_DEV,
        plug.inject(gulp.src(
          vendorFiles,
          conf
        ), {name: 'vendor'}
      )))

      // inject application files js
      .pipe(plug.inject(gulp.src(
        applicationFiles,
        {cwd: config.outputDir + 'client/'}
      ).pipe(plug.angularFilesort()), {name: 'application'}))

      // injects are done
      .pipe(gulp.dest(config.outputDir + 'client/'));
  };

})();
