'use strict';

var utils = require('../utils'),
    extend = utils.extend,
    load = utils.load;

[
    'base',
    'view',
    'service',
    'json-service',
].forEach(function(moduleName) {
    module.exports = extend(module.exports, require('./' + moduleName));
});

function get(working) {
    return load(working, 'controllers');
}

module.exports.get = get;
