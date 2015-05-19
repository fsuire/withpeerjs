'use strict';

process.env.ENV = 'dev';

var IoC = require('electrolyte');

IoC.loader(IoC.node_modules());
IoC.loader(IoC.node('dist/dev/server'));

// var primus = IoC.create('services/primus.service');
var primus = IoC.create('services/socketIO.service');
