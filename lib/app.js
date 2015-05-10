'use strict';

var async = require('async'),
    express = require('express'),
    extend = require('extend'),
    fmt = require('simple-fmt'),
    goa = require('goa'),
    load = require('./load'),
    logging = require('./logging'),
    joi = require('joi'),
    path = require('path'),
    reflekt = require('reflekt');

function factory(resolver) {
    return function factory(name, context, callback) {
        var controller = resolver(name);

        if (!controller) {
            throw new Error(fmt('Controller {0} not defined!', name));
        }

        resolver.add('context', context);
        controller = reflekt.construct(controller, resolver);
        callback && callback(null, controller);
    };
}

function init(app, config) {
    var loggingConfig = config.logging || {};

    if (loggingConfig.enabled) {
        // setup logging
        logging.init(app, loggingConfig);
    }

    if ((config.static || {}).enabled) {
        app.use(config.static.url || '/static', express.static(config.static.path || 'public'));
    }

    if ((config.views || {}).enabled) {
        var engine = require(path.resolve('./node_modules/' + config.views.engine));
        app.engine(config.views.engine, engine.__express);
        app.set('view engine', config.views.engine);
    }
}

function configure(config, resolver, callback) {
    function doLoadCore(next) {
        async.eachSeries([
                'controllers',
                'repositories',
                'services'
            ],
            function(modName, next) {
                load.object(require('./' + modName), resolver, next);
            }, next);
    }

    function doLoadDependencies(next) {
        async.eachSeries(config.dependencies || [],
            function(modName, next) {
                load.load(config, modName, resolver, next);
            }, next);
    }

    function doLoadProject(next) {
        async.eachSeries(config.modules || [],
            function(modName, next) {
                load.load(config, modName, resolver, next);
            }, next);
    }

    async.series([
        doLoadCore,
        doLoadDependencies,
        doLoadProject
    ], callback);
}

function start(argv, config, callback) {
    var resolver = new reflekt.ObjectResolver({
            config: config,
            argv: argv,
            logging: logging,
            schema: joi
        }),
        app = goa(factory(resolver), { defaultAction: 'handle' }),
        caller = reflekt.caller(resolver);

    resolver.add('app', app);
    resolver.add('caller', caller);
    resolver.add('resolver', resolver);

    function doInit(next) {
        init(app, config);
        resolver.add('log', logging.get(((config.logging || {}).app || {}).logger || 'app'));
        next();
    }

    function doConfigure(next) {
        configure(app, caller.resolver, next);
    }

    async.series([
        doInit,
        doConfigure
    ], function(err) {
        if (err) {
            callback && callback(err);
            return;
        }

        var port = config.port || process.env.PORT || 3000;
        app.set('port', port);
        app.listen(port, function () {
            callback && caller(callback);
        });
    });
}

extend(module.exports, {
    configure: configure,
    factory:   factory,
    init:      init,
    start:     start
});
