'use strict';

process.env.ENV = 'prod';

var IoC = require('electrolyte');

IoC.loader(IoC.node_modules());
IoC.loader(IoC.node('dist/prod/server'));

var rewriter = IoC.create('express-rewrite');
var config = IoC.create('services/config');
var app = IoC.create('app/application');


var server = IoC.create('http').createServer(app);

var Primus = IoC.create('primus');
var primusMultiplex = IoC.create('primus-multiplex');
var primusEmitter = IoC.create('primus-emitter');
var primusResource = IoC.create('primus-resource');

var primus = new Primus(server, {transformer: 'websockets'});
primus.use('multiplex', primusMultiplex);
primus.use('emitter', primusEmitter);
primus.use('resource', primusResource);

primus.on('connection', function connection(spark) {
    // Si un utilisateur envoie un message
    spark.on('tchat-send-message', function(data) {
      // alors, notifie tout les utilisateurs
      primus.send('tchat-send-message', data);
      console.log(data);
    });
});

primus.save(config.primusClientPath);

server.listen(config.port, config.ipaddress, function () {

  app.use(rewriter);

  var host = server.address().address;
  var port = server.address().port;

  console.log('Example app listening at http://%s:%s', host, port);

});
