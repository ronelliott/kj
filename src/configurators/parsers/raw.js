'use strict';

function init(app, config) {
    if (config.parsers.raw.enabled) {
        var bodyParser = require('body-parser'),
            parser = bodyParser.raw(config.parsers.raw.options);
        app.use(parser);
    }
}

module.exports = {
    init: init,
};
