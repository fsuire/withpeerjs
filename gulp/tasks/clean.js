var config = require('../config');
var del    = require('del');

exports.task = function(done) {
  del(config.outputDir, function (err, paths) {
    console.log('Deleted files/folders:\n', paths.join('\n'));
    done(err);
  });
};
