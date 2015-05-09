'use strict';

var async = require('async'),
    express = require('express'),
    extend = require('extend'),
    fmt = require('simple-fmt'),
    goa = require('goa'),
    joi = require('joi'),
    path = require('path'),
    reflekt = require('reflekt'),
    requireDirectory = require('require-directory'),
    winston = require('winston');

function loadObject(obj, resolver, callback) {
    async.eachSeries(Object.keys(obj),
        function(key, next) {
            var value = obj[key],
                kind = typeof(value);

            if (kind === 'function') {
                resolver.add(key, value);
                next();
                return;
            }

            if (kind === 'object') {
                loadObject(value, resolver, next);
                return;
            }

            throw new Error('Unable to load: ' + obj.toString());
        }, callback);
}

function loadSubmodule(submod, resolver, callback) {
    if (typeof(submod) === 'function') {
        var resolutions = extend(true, {}, resolver.items, { callback: callback });
        reflekt.call(submod, resolutions);
        return;
    }

    if (typeof(submod) === 'object') {
        loadObject(submod, resolver, callback);
        return;
    }

    throw new Error('Unable to load: ' + submod.toString());
}

function load(config, modName, resolver, callback) {
    var modPath = modName,
        mod;

    if (modPath.indexOf('.') === 0) {
        modPath = path.resolve(process.cwd(), modPath);
        mod = requireDirectory({ require: require }, modPath);
    } else {
        mod = require(path.resolve('./node_modules/' + modPath));
    }

    async.eachSeries(config.submodules || [],
        function(submodName, next) {
            var submod = mod[submodName];

            if (!submod) {
                next();
                return;
            }

            loadSubmodule(submod, resolver, next);
        }, callback);
}

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

function formatter(input, items) {
    return fmt.obj(input, items);
}

function start(argv, config, callback) {
    var loggingConfig = config.logging || {},
        port = config.port || process.env.PORT || 3000,
        resolver = new reflekt.ObjectResolver({
            config: config,
            argv: argv,
            loggers: winston.loggers,
            schema: joi
        }),
        app = goa(factory(resolver), { defaultAction: 'handle' }),
        caller = reflekt.caller(resolver);

    if (loggingConfig.enabled) {
        // setup logging
        Object.keys(loggingConfig.loggers || {}).forEach(function (name) {
            var logger = loggingConfig.loggers[name],
                format = logger.format || '{level} - {message}';

            Object.keys(logger).reduce(function(transports, name) {
                var transport = logger[name];
                transport.formatter = transport.formatter || fmtr;
                transports[name] = transport;
                return transports;
            }, {});

            function fmtr(items) {
                return formatter(format, extend({}, items));
            }

            winston.loggers.add(name, logger);
        });

        var httpLoggingConfig = loggingConfig.http || {},
            httpLog = winston.loggers.get(httpLoggingConfig.logger || 'http'),
            httpLogFormat = httpLoggingConfig.format || '{method} - {status} - {duration}ms - {path}',
            httpLogLevel = httpLoggingConfig.level || 'debug';

        app.use(function(req, res, next) {
            var start = new Date();
            res.on('finish', function() {
                var finish = new Date(),
                    duration = finish - start,
                    message = formatter(httpLogFormat, {
                        duration: duration,
                        method: req.method,
                        path: req.path,
                        protocol: req.protocol,
                        status: res.statusCode
                    });
                httpLog[httpLogLevel](message);
            });
            next();
        });
    }

    var log = winston.loggers.get((loggingConfig.app || {}).logger || 'app');

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
                loadObject(require('./' + modName), resolver, next);
            }, next);
    }

    function doLoadDependencies(next) {
        async.eachSeries(config.dependencies || [],
            function(modName, next) {
                load(config, modName, resolver, next);
            }, next);
    }

    function doLoadProject(next) {
        async.eachSeries(config.modules || [],
            function(modName, next) {
                load(config, modName, resolver, next);
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
