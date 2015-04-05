'use strict';

var utils = require('../utils'),
    extend = utils.extend,
    load = utils.load;

[
    'base',
    'cache',
    'postgres',
    'redis',
].forEach(function(moduleName) {
    module.exports = extend(module.exports, require('./' + moduleName));
});

function get(working) {
    return load(working, 'repositories');
}

module.exports.get = get;

