(function() {
  'use strict';

  module.exports = tchatRoute;

  tchatRoute['@singleton'] = true;
  tchatRoute['@require'] = ['services/config'];

  function tchatRoute(config) {

    return function(application) {
      application.get('/resource/:domain/:name/:id.json', function(req, res) {
        if(req.headers.accept.indexOf('application/json') >= 0) {
          res.setHeader('Content-Type', 'application/json');
          var response = {
            domain: req.params.domain,
            name: req.params.name,
            id: req.params.id
          };
          res.send(JSON.stringify(response));
        } else {
          res.status(406);
          res.send('Oooups ! Error 406 ! "Not Acceptable" !');
        }
      });
    };

  }

})();
