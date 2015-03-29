'use strict';

var utils = require('../utils');

function init(app, config) {
    if (config.logging.enabled) {
        var winston = require('winston');
        utils.logger.init(config.logging.loggers, winston);
        var httpLog = winston.loggers.get('http');
        app.use(utils.logger.middleware(config.logging.middleware, httpLog));
        return {
            get: function get(name) {
                return winston.loggers.get(name);
            }
        };
    }
}

module.exports = {
    init: init,
};
