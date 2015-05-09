(function() {
  'use strict';

  module.exports = primusService;

  primusService['@singleton'] = true;
  primusService['@require'] = [
    'primus',
    'primus-multiplex',
    'primus-emitter',
    'primus-resource',
    'services/http.service',
    'services/config'
  ];

  function primusService(Primus, primusMultiplex, primusEmitter, primusResource, server, config) {

    var primus = new Primus(server, {transformer: 'websockets'});
    primus.use('multiplex', primusMultiplex);
    primus.use('emitter', primusEmitter);
    primus.use('resource', primusResource);

    primus.on('connection', connection);

    primus.save(config.primusClientPath);

    return primus;

    function connection(spark) {
      // Si un utilisateur envoie un message
      spark.on('tchat-send-message', function(data) {
        // alors, notifie tout les utilisateurs
        primus.send('tchat-send-message', data);
        console.log(data);
      });

    }

  }

})();
