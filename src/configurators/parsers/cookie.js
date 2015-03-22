'use strict';

function init(app, config) {
    if (config.parsers.cookie.enabled) {
        var cookieParser = require('cookie-parser'),
            parser = cookieParser(
                config.parsers.cookie.options.secret,
                config.parsers.cookie.options);
        app.use(parser);
    }
}

module.exports = {
    init: init,
};
