'use strict';

var utils = require('../../utils'),
    extend = utils.extend,
    inject = utils.inject,
    load = utils.load,
    parserNames = [
        'cookie',
        'json',
        'multipart',
        'raw',
        'text',
        'urlencoded',
    ];

parserNames.forEach(function(moduleName) {
    module.exports[moduleName] = require('./' + moduleName);
});

function get(working) {
    return load(working, 'configurators/parsers');
}

function init(app, config, log, working) {
    var parsers = get(working),
        caller = inject.caller({
            app: app,
            config: config,
            log: log,
            working: working,
        });

    config.ki.parsers.forEach(function(name) {
        var parser = parsers[name];
        if (parser) {
            log.debug('Running parser configurator:', name);
            caller(parser.init);
        } else {
            log.error('No parser found named:', name);
        }
    });
}

extend(module.exports, {
    get:  get,
    init: init
});
