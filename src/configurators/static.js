'use strict';

var express = require('express'),
    path = require('../utils').path;

function init(app, config, working, log) {
    if (config.static.enabled) {
        var staticPath = path.absolute(path.join(working, config.static.options.path)),
            url = config.static.options.url;
        log.info('Static serving enabled.');
        log.debug('\tusing url:', url);
        log.debug('\tusing path:', staticPath);
        app.use(url, express.static(staticPath));
    } else {
        log.warn('Static serving disabled!');
    }
}

module.exports = {
    init: init,
};
