(function() {
  'use strict';

  console.log('bootstrap');

  process.env.ENV = 'dev';

  var IoC = require('electrolyte');
  IoC.loader(IoC.node_modules());
  IoC.loader(IoC.node('../'));

  module.exports = IoC;

})();
