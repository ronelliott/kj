'use strict';

var utils = require('../utils'),
    extend = utils.extend,
    load = utils.load,
    inject = utils.inject,
    configuratorNames = [
        'csrf',
        'helmet',
        'logging',
        'parsers',
        'session',
        'static',
        'views',
    ];

configuratorNames.forEach(function(moduleName) {
    module.exports[moduleName] = require('./' + moduleName);
});

function get(working) {
    return load(working, 'configurators');
}

function init(app, config, log, working, configurators) {
    configurators = configurators || get(working);

    var caller = inject.caller({
            app: app,
            config: config,
            log: log,
            working: working,
        });


    config.ki.configurators.forEach(function(name) {
        var configurator = configurators[name];
        if (configurator) {
            log.debug('Running configurator:', name);
            caller(configurator.init);
        } else {
            log.error('No configurator found named:', name);
        }
    });
}

extend(module.exports, {
    get:  get,
    init: init
});
