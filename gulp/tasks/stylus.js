(function() {
  'use strict';

  // Compile *.styl

  var nib = require('nib');

  exports.task = function() {
    var compress = true;
    if(IS_DEV) {
      compress = false;
    }

    return gulp
      .src(config.client.stylusFiles)
      .pipe(plug.stylus({
        use: nib(),
        compress: compress
      }))
      .pipe(gulp.dest('src/' + config.client.styleDir));
  };

})();
