(function() {
  'use strict';

  // Lint client js

  exports.task = function() {
    return gulp
      .src(config.client.jsFiles)
      .pipe(plug.jshint())
      .pipe(plug.jshint.reporter('jshint-stylish'))
      .pipe(plug.jshint.reporter('fail'))
      .pipe(plug.jscs());
  };

})();
