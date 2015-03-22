'use strict';

var utils = require('../utils'),
    logger = utils.logger;

function start(config, working, caller) {
    var module = require('./').app;

    var app = caller(module.init);
    app.set('port', config.server.port);
    app.listen(config.server.port, function () {
        logger.get('app').info('Listening on', config.server.port);
    });

    return app;
}

module.exports = {
    start: start,
};
