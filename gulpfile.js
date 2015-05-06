(function() {
  'use strict';

  var _ = require('lodash');

  var gulp = require('gulp-help')(require('gulp'));
  var plug = require('gulp-load-plugins')({ lazy: false });

  var runSequence = require('run-sequence');
  var del         = require('del');
  var bowerFiles  = require('bower-files')();
  var browserSync = require('browser-sync');
  var karma       = require('karma').server;


  var nib = require('nib');

  var log = plug.util.log;
  var env = plug.util.env;
  var environment = 'dev';

  var config = {
    distPath: 'dist/dev/'
  };

  if(env.prod) {
    config.distPath = 'dist/prod/';
    environment = 'prod';
  }



  // --------------------------------------------------------------------------------
  // --------------------------------------------------------------------------------
  // --------------------------------------------------------------------------------

  var hasBeenClean = false;
  gulp.task('clean', 'Clean the distPath', function(callback) {
    log('---> clean');
    if(!hasBeenClean) {
      hasBeenClean = true;
      del(config.distPath, function(err, deletedFiles) {
        deletedFiles.forEach(function(file) {
          log('File deleted:', file);
        });
        callback(err);
      });

    } else {
      callback();
    }

  });

  // --------------------------------------------------------------------------------

  gulp.task('copy-server', 'Copy server code from src to the distPath', function() {
    log('---> copy-server');
    return gulp
      .src(['src/server/**/*', '!src/server/**/*.spec.js'])
      .pipe(plug.newer(config.distPath + 'server/'))
      .pipe(gulp.dest(config.distPath + 'server/'));
  });

  // --------------------------------------------------------------------------------

  gulp.task('copy-client', 'Copy client code from src to the distPath', function() {
    log('---> copy-client');
    return plug.merge(
      gulp
        .src('src/client/**/*.css')
        .pipe(plug.newer(config.distPath + 'client/'))
        .pipe(gulp.dest(config.distPath + 'client/'))
        .pipe(browserSync.reload({ stream: true })),
      gulp
        .src(['src/client/**/*.{js,html,json}', '!src/client/**/*.spec.js'])
        .pipe(plug.newer(config.distPath + 'client/'))
        .pipe(gulp.dest(config.distPath + 'client/'))
        .pipe(browserSync.reload({ stream: true }))
    );
  });

  // --------------------------------------------------------------------------------

  gulp.task('copy-js-root-assets', 'Copy the primus.js from src to the distPath', function() {
    log('---> copy-js-root-assets');
    return gulp
      .src(['src/client/assets/*.js'])
      .pipe(plug.newer(config.distPath + 'client/assets/'))
      .pipe(gulp.dest(config.distPath + 'client/assets/'));
  });

  // --------------------------------------------------------------------------------

  gulp.task('vendor', 'Bundle and minify dependencies', function() {
    log('---> vendor');
    return plug.merge(
      gulp
        .src(bowerFiles.ext('css').files)
        .pipe(plug.newer(config.distPath + 'client/assets/styles/vendor.min.css'))
        .pipe(plug.concat('vendor.css'))
        .pipe(gulp.dest(config.distPath + 'client/assets/styles/'))
        .pipe(plug.rename({suffix: '.min'}))
        .pipe(plug.bytediff.start())
        .pipe(plug.minifyCss())
        .pipe(plug.bytediff.stop(bytediffFormatter))
        .pipe(gulp.dest(config.distPath + 'client/assets/styles/'))
        .pipe(browserSync.reload({ stream: true })),
      gulp
        .src(bowerFiles.ext('js').files)
        .pipe(plug.newer(config.distPath + 'client/assets/scripts/vendor.min.js'))
        .pipe(plug.concat('vendor.js'))
        .pipe(gulp.dest(config.distPath + 'client/assets/scripts/'))
        .pipe(plug.rename({suffix: '.min'}))
        .pipe(plug.bytediff.start())
        .pipe(plug.uglify())
        .pipe(plug.bytediff.stop(bytediffFormatter))
        .pipe(gulp.dest(config.distPath + 'client/assets/scripts/'))
        .pipe(browserSync.reload({ stream: true }))
      );
  });

  // --------------------------------------------------------------------------------

  gulp.task('application-minify', 'Bundle and minify dependencies', function() {
    log('---> application-minify');
    return plug.merge(
      gulp
        .src('src/client/**/*.css')
        .pipe(plug.newer(config.distPath + 'client/assets/styles/vendor.min.css'))
        .pipe(plug.concat('application.css'))
        .pipe(gulp.dest(config.distPath + 'client/assets/styles/'))
        .pipe(plug.rename({suffix: '.min'}))
        .pipe(plug.bytediff.start())
        .pipe(plug.minifyCss())
        .pipe(plug.bytediff.stop(bytediffFormatter))
        .pipe(gulp.dest(config.distPath + 'client/assets/styles/'))
        .pipe(browserSync.reload({ stream: true })),
      gulp
        .src(['src/client/**/*.js', '!src/client/**/*.spec.js'])
        .pipe(plug.newer(config.distPath + 'client/assets/scripts/application.min.js'))
        .pipe(plug.angularFilesort())
        .pipe(plug.concat('application.js'))
        .pipe(gulp.dest(config.distPath + 'client/assets/scripts/'))
        .pipe(plug.rename({suffix: '.min'}))
        .pipe(plug.bytediff.start())
        .pipe(plug.uglify())
        .pipe(plug.bytediff.stop(bytediffFormatter))
        .pipe(gulp.dest(config.distPath + 'client/assets/scripts/'))
        .pipe(browserSync.reload({ stream: true })),
      gulp
        .src('src/client/**/*.html')
        .pipe(plug.newer(config.distPath + 'client/assets/scripts/templatecache.min.js'))
        .pipe(plug.minifyHtml())
        .pipe(plug.angularTemplatecache('templatecache.js', {
          module: 'app.core',
          standalone: false
        }))
        .pipe(gulp.dest(config.distPath + 'client/assets/scripts/'))
        .pipe(plug.rename({suffix: '.min'}))
        .pipe(plug.bytediff.start())
        .pipe(plug.uglify())
        .pipe(plug.bytediff.stop(bytediffFormatter))
        .pipe(gulp.dest(config.distPath + 'client/assets/scripts/'))
        .pipe(browserSync.reload({ stream: true }))
      );
  });

  // --------------------------------------------------------------------------------

  gulp.task('stylus', 'Compile *.styl', function() {
    log('---> stylus');
    var compress = false;
    if(env.prod) {
      compress = true;
    }

    return gulp
      .src('src/client/assets/style/stylus/main.styl')
      .pipe(plug.stylus({
        use: nib(),
        compress: compress
      }))
      .pipe(gulp.dest('src/client/assets/style'));
  });

  // --------------------------------------------------------------------------------

  gulp.task('karma', 'Run tests on the client code', function(callback) {
    log('---> karma');
    karma.start({
      configFile: __dirname + '/karma.conf.js'
    }, callback);
  });

  // --------------------------------------------------------------------------------

  gulp.task('backend-test', 'Run tests on the server code', function(callback) {
    log('---> backend-test');
    process.env.ENV = 'dev';
    gulp.src(['src/server/**/*.js', '!src/server/**/*.spec.js'])
    .pipe(plug.istanbul()) // Covering files
    .pipe(plug.istanbul.hookRequire()) // Force `require` to return covered files
    .on('finish', function () {
      gulp.src('src/server/specs/*.js')
        .pipe(plug.jasmine())
        .pipe(plug.istanbul.writeReports({
          dir: 'reports/server/',
          reporters: [
            'lcov',
            'html'
          ]
        })) // Creating the reports after tests runned
        .on('end', callback);
    });
  });

  // --------------------------------------------------------------------------------

  gulp.task('lint-scripts', 'Lint scripts.', function() {
    return gulp
      .src(['src/**/*.js', '!src/client/assets/primus.js'])
      .pipe(plug.jshint())
      .pipe(plug.jshint.reporter('jshint-stylish'))
      .pipe(plug.jshint.reporter('fail'))
      .pipe(plug.jscs());
  });

  // --------------------------------------------------------------------------------

  gulp.task('inject-dev', 'Make injection to the index.html dev file', function() {
    log('---> inject-dev');
    return gulp.src('src/client/index.html')

      // Inject assets css
      .pipe(plug.inject(gulp.src(
        'assets/**/*.css',
        {read: false, cwd: config.distPath + 'client'}
      ), {name: 'assets'}))

      // Inject assets js
      .pipe(plug.inject(gulp.src(
        'assets/**/*.js',
        {read: false, cwd: config.distPath + 'client'}
      ), {name: 'assets'}))

      // inject bowerfiles js
      .pipe(plug.inject(gulp.src(
        bowerFiles.ext('js').files,
        {read: false}
      ), {name: 'vendor'}))

      // inject application files js
      .pipe(plug.inject(gulp.src(
        'app/**/*.js',
        {cwd: config.distPath + 'client'}
      ).pipe(plug.angularFilesort()), {name: 'application'}))

      // injects are done
      .pipe(gulp.dest(config.distPath + 'client/'));
  });

  // --------------------------------------------------------------------------------

  gulp.task('inject-prod', 'Make injection to the index.html prod file', function() {
    log('---> injec-prod');
    return gulp.src('src/client/index.html')

      // Inject assets css
      .pipe(plug.inject(gulp.src(
        'assets/**/*.min.css',
        {read: false, cwd: config.distPath + 'client'}
      ), {name: 'assets'}))

      // Inject assets js
      .pipe(plug.inject(gulp.src(
        'assets/*.js',
        {read: false, cwd: config.distPath + 'client'}
      ), {name: 'assets'}))

      // Inject vendor js
      .pipe(plug.inject(gulp.src(
        ['assets/scripts/vendor.min.js'],
        {read: false, cwd: config.distPath + 'client'}
      ), {name: 'vendor'}))

      // inject application files js
      .pipe(plug.inject(gulp.src(
          ['assets/scripts/application.min.js', 'assets/scripts/templatecache.min.js'],
          {cwd: config.distPath + 'client'}
        ), {name: 'application'})
       )

      // injects are done
      .pipe(gulp.dest(config.distPath + 'client/'));
  });

  // --------------------------------------------------------------------------------
  // ----------------------------- WATCH ---------------------------------------------
  // --------------------------------------------------------------------------------

  gulp.task('watch', 'Watch changes and apply tasks', ['build'], function() {
    log('---> watch');
    gulp
      .watch('src/client/assets/**/*.styl', function() {
        runSequence('stylus');
      })
      .on('change', logWatch);

    gulp
      .watch('src/client/assets/**/*.css', function() {
        runSequence('build');
      })
      .on('change', logWatch);

    gulp
      .watch('src/client/**/*.js', function() {
        runSequence('karma', 'build');
      })
      .on('change', logWatch);

    gulp
      .watch('src/client/**/*.html', function() {
        runSequence('build');
      })
      .on('change', logWatch);

    gulp
      .watch('src/server/**/*.js', function() {
//        runSequence('backend-test', 'build');
        runSequence('build');
      })
      .on('change', logWatch);

//    gulp
//      .watch('src/client/assets/**/*.{js,html,json}', function() {
//        log('JS, HTML or JSON change !');
//        runSequence('copy-client', 'inject-dev');
//      })
//      .on('change', logWatch);

    function logWatch(event) {
      log('File ' + event.path + ' was ' + event.type + ', running tasks...');
    }
  });

  // --------------------------------------------------------------------------------
  // ----------------------------- BUILD --------------------------------------------
  // --------------------------------------------------------------------------------

  gulp.task('build', 'Build in the distPath', function(callback) {

    switch(environment) {
      case 'prod':
        log('---> build : ' + environment);
        runSequence(
          ['lint-scripts'],
          ['clean'],
          ['stylus'],
          ['copy-server', 'copy-js-root-assets', 'vendor', 'application-minify'],
          ['inject-prod'],
          callback
        );
        break;

      case 'dev':
      default:
        log('---> build : ' + environment);
        runSequence(
          ['lint-scripts'],
          ['clean'],
          ['stylus'],
          ['copy-client', 'copy-server'],
          ['inject-dev'],
//          ['browsersync'],
          callback
        );
    }


  }, {
    options: {
      '': 'Launch build for dev',
      prod: 'Launch build for prod'
    }
  });

  // --------------------------------------------------------------------------------
  // ----------------------------- LAUNCH NODEJS SERVER -----------------------------
  // --------------------------------------------------------------------------------

  gulp.task('serve', 'Run a server, with an environment config', /*['build'], */['watch'], function() {
    log('---> serve : ' + environment);
    var browserSyncLoadingDelay = 1000;

    var script = 'server_dev';
    if(env.prod) {
      script = 'server';
    }


    plug
      .nodemon({
        script: script,
        delayTime: 2,
        ext: 'js html',
        ignore: ['primus.js'],
        execMap: {
          js: 'nodejs'
        },
//        tasks: ['browsersync'],
//        tasks: ['build'],
        watch: [
          config.distPath + 'server/'
//          ,
//          'src/client/**/*.js',
//          'src/client/**/*.html'
        ]
      })
      //.on('start', function() {
      //  log('*** nodemon started');
      //  setTimeout(serve, 1000);
      //})
      .on('start', /*['build'], */function() {
        log('*** nodemon started');
        setTimeout(serve, 1000);
//        runSequence('build');
//        serve();
      })
      .on('restart', function(ev) {
        log('*** nodemon restarted');
        log('*** files changed:\n' + ev);
//        runSequence('build', 'browsersync');
//        runSequence('build');
      })
      .on('change', /*['build'], */function () {
        log('*** nodemon : script change');
//        runSequence(['build']/*, 'browsersync'*/);
      })
      .on('crash', function () {
        log('*** nodemon crashed: script crashed for some reason', arguments);
      })
      .on('exit', function () {
        log('*** nodemon exited cleanly');
      });

  }, {
    options: {
      '': 'Launch the server with dev config',
      prod: 'Launch the server with prod config'
    }
  });

  // --------------------------------------------------------------------------------

  gulp.task('browsersync', 'browser sync', ['watch'], function(callback) {
    log('---> browsersync');

    if (browserSync.active) {
      setTimeout(function() {
          log('browserSync reloads now');
          browserSync.notify('reloading now ...');
          browserSync.reload({stream: false});
        }, 1000);
      return;
    }

    var port = 3000;
    if(env.prod) {
      port = 3100;
    }

    browserSync({
      proxy: 'localhost:' + port,
      logLevel: 'debug'
    }, callback);

  });

  function serve() {

    log('---> serve function');

    if (browserSync.active) {
      setTimeout(function() {
          log('browserSync reloads now');
          browserSync.notify('reloading now ...');
          browserSync.reload({stream: false});
        }, 1000);
      return;
    }

    var port = 3000;
    if(env.prod) {
      port = 3100;
    }

    browserSync({
      proxy: 'localhost:' + port
    });
  }

  // --------------------------------------------------------------------------------

  /**
   * Formatter for bytediff to display the size changes after processing
   * @param  {Object} data - byte data
   * @return {String} Difference in bytes, formatted
   */
  function bytediffFormatter(data) {
    var difference = (data.savings > 0) ? ' smaller.' : ' larger.';
    return data.fileName + ' went from '
      + (data.startSize / 1000).toFixed(2) + ' kB to ' + (data.endSize / 1000).toFixed(2) + ' kB'
      + ' and is ' + ((1 - data.percent) * 100).toFixed(2) + '%' + difference;
  }
})();
