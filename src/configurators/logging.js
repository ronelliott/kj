'use strict';

function init(app, config) {
    if (config.logging.enabled) {
        var logger = require('../utils').logger;
        logger.init(config.logging.loggers);
        var httpLog = logger.get('http');
        app.use(logger.middleware(config.logging.middleware, httpLog));
    }
}

module.exports = {
    init: init,
};
