'use strict';

[
    'path',
    'app',
    'colors',
    'extend',
    'inherits',
    'inject',
    'load',
    'logger',
    'redis',
    'validation',
].forEach(function(moduleName) {
    module.exports[moduleName] = require('./' + moduleName);
});
