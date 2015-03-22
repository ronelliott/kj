'use strict';

var utils = require('../utils'),
    extend = utils.extend,
    path = utils.path,
    defaultConfig = require('./default');

function get(name) {
    var config = {};

    if (name) {
        try {
            var configPath = path.absolute(name);
            config = require(configPath);
        } catch(e) {
            if (e.code === 'MODULE_NOT_FOUND') {
                console.error('Config not found: %s.js', configPath);
            } else {
                throw e;
            }
        }
    }

    return config;
}

module.exports = function(name) {
    var config = extend(true, {}, defaultConfig, get(name));
    return config;
};
