var config = require('./config');
var path   = require('path');
var args   = require('minimist')(process.argv.slice(2));

exports.ROOT        = path.normalize(__dirname + '/..');
exports.VERSION     = args.version || require('../package.json').version;
exports.SERVER_PORT = args.port || 8080;
exports.IS_DEV      = args.dev;
exports.IS_PROD     = args.prod;
