(function() {
  'use strict';

  module.exports = indexRoute;

  indexRoute['@singleton'] = true;
  indexRoute['@require'] = ['services/getHtmlFile.service', 'services/config'];

  function indexRoute(getHtml, config) {

    return function(application) {

      application.get('/*', function(req, res, next) {

        if(typeof req.headers.accept === 'string' && req.headers.accept.indexOf('text/html') >= 0) {
          getHtml(config.htmlIndexPath)
            .then(function(data) {
              res.setHeader('Content-Type', 'text/html');
              res.send(data);
            });
        } else {
          next();
        }

      });

    };

  }

})();
