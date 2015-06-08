(function() {
  'use strict';

  // Run tests on the server code

  var utils = require('../utils');
  var args  = require('minimist')(process.argv.slice(2));

  exports.task = function(done) {
    var jsFiles = config.server.jsFiles
      .concat(config.server.jsDevFiles);
console.log(jsFiles);
    return gulp
      .src(jsFiles)
      .pipe(plug.istanbul()) // Covering files
      .pipe(plug.istanbul.hookRequire()) // Force `require` to return covered files
      .on('finish', function () {
        gulp.src(jsFiles)
          .pipe(plug.jasmine())
          .pipe(plug.istanbul.writeReports({
            dir: config.reportsDir,
            reporters: [
              'lcov',
              'html'
            ]
          })); // Creating the reports after tests runned
          //.on('end', done);
      });

    if (args.tdd) {
      gulp
        .watch(jsFiles, ['backend-test'])
        .on('change', utils.logWatch);
    }
  };
})();
