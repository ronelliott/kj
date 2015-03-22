'use strict';

function init(app, config) {
    if (config.parsers.urlencoded.enabled) {
        var bodyParser = require('body-parser'),
            parser = bodyParser.urlencoded(config.parsers.urlencoded.options);
        app.use(parser);
    }
}

module.exports = {
    init: init,
};
