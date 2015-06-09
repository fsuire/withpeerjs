(function() {
  'use strict';

  // Build the application

  var runSequence = require('run-sequence');

  exports.task = function(callback) {

    if (IS_DEV) {
      runSequence(
        ['lint-js'],
        ['stylus'],
        ['copy-client', 'copy-server'],
        ['inject'],
        callback
      );
    } else {
      runSequence(
        ['lint-js'],
        ['stylus'],
        ['copy-server', 'vendor', 'application-minify'],
        ['inject'],
        callback
      );
    }

  };

})();
