'use strict';

function init(app, config, log) {
    if (config.helmet.enabled) {
        log.info('Helmet enabled.');
        var helmet = require('helmet');
        app.use(helmet());
    } else {
        log.warn('Helmet disabled!');
    }
}

module.exports = {
    init: init,
};
