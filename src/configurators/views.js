'use strict';

var path = require('../utils').path;

function init(app, config, working, log) {
    if (config.views.enabled) {
        var viewsPath = path.absolute(path.join(working, config.views.options.path)),
            engine = config.views.options.engine;
        log.info('Rendering engine enabled.');
        log.debug('\tusing engine:', engine);
        log.debug('\tusing path:', viewsPath);
        app.set('views', viewsPath);
        app.set('view engine', engine);
    } else {
        log.warn('Rendering engine disabled!');
    }
}

module.exports = {
    init: init,
};
