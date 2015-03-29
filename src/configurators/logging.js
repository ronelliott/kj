'use strict';

var utils = require('../utils');

function init(app, config) {
    if (config.logging.enabled) {
        var winston = require('winston'),
            logger = utils.logger.init(config.logging.loggers, winston),
            httpLog = logger.get('http');
        app.use(utils.logger.middleware(config.logging.middleware, httpLog));
        return {
            get: function get(name) {
                return winston.get(name);
            }
        };
    }
}

module.exports = {
    init: init,
};
