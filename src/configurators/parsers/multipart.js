'use strict';

function init(app, config) {
    if (config.parsers.multipart.enabled) {
        var multipartParser = require('connect-multiparty'),
            parser = multipartParser(config.parsers.multipart.options);
        app.use(parser);
    }
}

module.exports = {
    init: init,
};
