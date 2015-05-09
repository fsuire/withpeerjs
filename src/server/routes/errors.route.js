(function() {
  'use strict';

  module.exports = errorsRoute;

  errorsRoute['@singleton'] = true;
  errorsRoute['@require'] = ['services/getHtmlFile.service', 'services/config'];

  function errorsRoute(getHtml, config) {

    return function(application) {
      application.use(function(req, res) {

        getHtml(config.htmlErrorPath)
          .then(function(data) {
            res.status(404);
            res.setHeader('Content-Type', 'text/html');
            res.send(data);
          })
          .fail(function(error) {
            res.status(500);
            res.send('Oooups ! Error 500 ! "Internal Server Error" !');
          });

      });
    };

  }

})();
