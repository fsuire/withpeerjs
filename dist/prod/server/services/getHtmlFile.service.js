(function() {
  'use strict';

  module.exports = getHtmlFile;

  getHtmlFile['@singleton'] = true;
  getHtmlFile['@require'] = ['fs', 'q'];

  function getHtmlFile(fs, q) {

    return function(path) {
      var deferred = q.defer();
      fs.readFile(path, "utf-8", function(error, text) {
        if(error) {
          deferred.reject(new Error(error));
        } else {
          deferred.resolve(text);
        }
      });
      return deferred.promise;
    };

  }

})();
