'use strict';

function init(app, config) {
    if (config.parsers.text.enabled) {
        var bodyParser = require('body-parser'),
            parser = bodyParser.text(config.parsers.text.options);
        app.use(parser);
    }
}

module.exports = {
    init: init,
};
