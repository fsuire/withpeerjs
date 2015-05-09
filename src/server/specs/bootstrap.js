(function() {
  'use strict';

  process.env.ENV = 'test';

  var IoC = require('electrolyte');
  IoC.loader(IoC.node_modules());
  IoC.loader(IoC.node(__dirname + '/..'));

  module.exports = IoC;
})();
