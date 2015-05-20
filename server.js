'use strict';

process.env.ENV = 'prod';

var IoC = require('electrolyte');

IoC.loader(IoC.node_modules());
IoC.loader(IoC.node('dist/prod/server'));

var primus = IoC.create('services/socketIO.service');
