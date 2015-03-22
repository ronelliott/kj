'use strict';

var utils = require('./'),
    extend = utils.extend,
    path = utils.path;

function load(working, item) {
    var base = require('../' + item),
        other = {};

    try {
        var modulePath = path.join(working, item);
        other = require(modulePath);
    } catch(e) {
        if (e.code !== 'MODULE_NOT_FOUND') {
            throw e;
        }
    }

    return extend({}, base, other);
}

module.exports = load;
