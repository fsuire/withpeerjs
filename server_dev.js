'use strict';

process.env.ENV = 'dev';

var IoC = require('electrolyte');

IoC.loader(IoC.node_modules());
IoC.loader(IoC.node('dist/dev/server'));

//IoC.create('services/socketIO.service');
//var server = IoC.create('services/http.service');

IoC.create('app/application');
