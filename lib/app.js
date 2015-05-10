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

function configure(app, config, callback) {
    var loggingConfig = config.logging || {};

    function doInitLogging(next) {
        if (loggingConfig.enabled) {
            // setup logging
            logging.init(app, loggingConfig);
        }

        next();
    }

    function doInitStaticFiles(next) {
        if ((config.static || {}).enabled) {
            app.use(config.static.url || '/static', express.static(config.static.path || 'public'));
        }

        next();
    }

    function doInitViews(next) {
        if ((config.views || {}).enabled) {
            var engine = require(path.resolve('./node_modules/' + config.views.engine));
            app.engine(config.views.engine, engine.__express);
            app.set('view engine', config.views.engine);
        }

        next();
    }

    async.series([
        doInitLogging,
        doInitStaticFiles,
        doInitViews
    ], callback);
}

function init(config, resolver, callback) {
    function doLoadCore(next) {
        async.eachSeries([
                'authorizer',
                'controllers',
                'repositories',
                'services'
            ],
            function(modName, next) {
                load.object(require('./' + modName), resolver, next);
            }, function(err) {
                if (!err) {
                    var authorizer = reflekt.construct('Authorizer', resolver);
                    resolver.add('auth', authorizer);
                    resolver.add('authorizer', authorizer);
                }

                next(err);
            });
    }

    function doLoadDependencies(next) {
        async.eachSeries(config.dependencies || [],
            function(modName, next) {
                load.load(config, modName, resolver, next);
            }, next);
    }

    console.log('config.modules', config.modules);
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

    function doConfigure(next) {
        configure(app, config, function(err) {
            if (!err) {
                resolver.add('log', logging.get(((config.logging || {}).app || {}).logger || 'app'));
            }

            next(err);
        });
    }

    function doInit(next) {
        init(config, caller.resolver, next);
    }

    async.series([
        doConfigure,
        doInit
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
