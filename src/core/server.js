'use strict';

function start(config, working, caller, container) {
    var module = require('./').app;

    var app = caller(module.init),
        logger = container.resolveSync('logger');
    app.set('port', config.server.port);
    app.listen(config.server.port, function () {
        logger.get('app').info('Listening on', config.server.port);
    });

    return app;
}

module.exports = {
    start: start,
};
