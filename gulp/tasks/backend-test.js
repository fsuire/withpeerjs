(function() {
  'use strict';

  // Run tests on the server code

  var utils = require('../utils');
  var args  = require('minimist')(process.argv.slice(2));

  exports.task = function(done) {
    process.env.ENV = 'dev';

    return gulp
      .src(config.server.jsFiles)
      .pipe(plug.istanbul()) // Covering files
      .pipe(plug.istanbul.hookRequire()) // Force `require` to return covered files
      .on('finish', function () {
        gulp.src(config.server.jsFiles)
          .pipe(plug.addSrc(config.server.jsDevFiles))
          .pipe(plug.jasmine())
          .pipe(plug.istanbul.writeReports({
            dir: config.reportsDir,
            reporters: [
              'lcov',
              'html'
            ]
          })) // Creating the reports after tests runned
          .on('end', done);
      });

    if (args.tdd) {
      gulp
        .watch(config.server.jsFiles, ['backend-test'])
        .on('change', utils.logWatch);

      gulp
        .watch(config.server.jsDevFiles, ['backend-test'])
        .on('change', utils.logWatch);
    }
  };
})();
