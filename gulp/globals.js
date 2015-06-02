'use strict';

var path = require('path');
var args = require('minimist')(process.argv.slice(2));

global.gulp        = require('gulp');
global.plug        = require('gulp-load-plugins')({ lazy: false });

global.config      = require('./config');

global.ROOT        = path.normalize(__dirname + '/..');
global.VERSION     = args.version || require('../package.json').version;
global.SERVER_PORT = args.port || 8080;
global.IS_SYNC     = args.sync;
global.IS_DEV      = args.dev;
global.IS_PROD     = args.prod;

if(IS_DEV) {
  global.config.outputDir  += 'dev/';
  global.config.reportsDir += 'dev/';
} else if(IS_PROD) {
  global.config.outputDir  += 'prod/';
  global.config.reportsDir += 'prod/';
}
