exports.task = function(done) {
  del([config.outputDir], function(error, paths) {
    log('Deleted files/folders:\n', paths.join('\n'));

    done(error);
  });
};
