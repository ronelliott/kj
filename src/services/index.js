'use strict';

var utils = require('../utils'),
    extend = utils.extend,
    load = utils.load;

[
    'base',
].forEach(function(moduleName) {
    module.exports = extend(module.exports, require('./' + moduleName));
});

function get(working) {
    return load(working, 'services');
}

module.exports.get = get;
