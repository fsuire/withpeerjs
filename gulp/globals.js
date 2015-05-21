global.del     = require('del');
global.fs      = require('fs');
global.gulp    = require('gulp');
global.path    = require('path');
global.plugins = require('gulp-load-plugins')({ lazy: false });

global.env    = global.plugins.util.env;
global.log    = global.plugins.util.log;
global.root   = global.path.normalize(__dirname + '/..');

global.IS_DEV = !!env.dev;

global.config = require('./config');
