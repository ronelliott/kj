'use strict';

function init(app, config, log) {
    if (config.session.enabled) {
        log.info('Sessions enabled.');
        var expressSession = require('express-session');
        app.use(expressSession(config.session.options));
    } else {
        log.warn('Sessions disabled!');
    }
}

module.exports = {
    init: init,
};
