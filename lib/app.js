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

function start(argv, config, callback) {
    var loggingConfig = config.logging || {},
        port = config.port || process.env.PORT || 3000,
        resolver = new reflekt.ObjectResolver({
            config: config,
            argv: argv,
            logging: logging,
            schema: joi
        }),
        app = goa(factory(resolver), { defaultAction: 'handle' }),
        caller = reflekt.caller(resolver);

    if (loggingConfig.enabled) {
        // setup logging
        logging.init(app, loggingConfig);
    }

    var log = logging.get((loggingConfig.app || {}).logger || 'app');

    resolver.add('app', app);
    resolver.add('caller', caller);
    resolver.add('resolver', resolver);
    resolver.add('log', log);

    if ((config.static || {}).enabled) {
        app.use(config.static.url || '/static', express.static(config.static.path || 'public'));
    }

    if ((config.views || {}).enabled) {
        var engine = require(path.resolve('./node_modules/' + config.views.engine));
        app.engine(config.views.engine, engine.__express);
        app.set('view engine', config.views.engine);
    }

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
    ], function(err) {
        if (err) {
            callback && callback(err);
            return;
        }

        app.set('port', port);
        app.listen(port, function () {
            callback && caller(callback);
        });
    });
}

extend(module.exports, {
    factory: factory,
    load:    load,
    start:   start
});
