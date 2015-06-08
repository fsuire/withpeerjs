(function() {
  'use strict';

  // Run a server, with an environment config

  var args  = require('minimist')(process.argv.slice(2));
  var browserSync = require('browser-sync');

  exports.task = function(done) {
    var browserSyncLoadingDelay = 1000;

    var script = 'server_dev';
    if(IS_PROD) {
      script = 'server';
    }

    plug
      .nodemon({
        script: script,
        delayTime: 2,
        ext: 'js html',
        ignore: [],
        execMap: {
          js: 'nodejs'
        },
        watch: [
          config.outputDir
        ]
      })
      .on('start', /*['build'], */function() {
        console.log('*** nodemon started');
        setTimeout(serve, 1000);
      })
      .on('restart', function(ev) {
        console.log('*** nodemon restarted');
        console.log('*** files changed:\n' + ev);
      })
      .on('change', /*['build'], */function () {
        console.log('*** nodemon : script change');
      })
      .on('crash', function () {
        console.log('*** nodemon crashed: script crashed for some reason', arguments);
      })
      .on('exit', function () {
        console.log('*** nodemon exited cleanly');
      });

      function serve() {
        if(args.nosync) {
          return;
        }

        console.log('---> serve function');

        if (browserSync.active) {
          setTimeout(function() {
              console.log('browserSync reloads now');
              browserSync.notify('reloading now ...');
              browserSync.reload({stream: false});
            }, 1000);
          return;
        }

        var port = 3000;
        if(IS_PROD) {
          port = 3100;
        }

        browserSync({
          proxy: 'localhost:' + port
        });
      }
  };
})();
