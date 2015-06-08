(function() {
  'use strict';

  // Build the application

    var runSequence = require('run-sequence');

  exports.task = function(callback) {

    if (IS_DEV) {
      runSequence(
        ['lint-js'],
        ['clean'],
        ['stylus'],
        ['copy-client', 'copy-server'],
        ['inject'],
        callback
      );
    } else {
      runSequence(
        ['clean'],
        ['lint-js'],
        ['stylus'],
        ['copy-server', 'vendor', 'application-minify'],
        ['inject'],
        callback
      );
    }

  };

})();
