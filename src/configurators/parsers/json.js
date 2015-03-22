'use strict';

function init(app, config) {
    if (config.parsers.json.enabled) {
        var bodyParser = require('body-parser'),
            parser = bodyParser.json(config.parsers.json.options);
        app.use(parser);
    }
}

module.exports = {
    init: init,
};
