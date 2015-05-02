'use strict';

var async = require('async'),
    extend = require('extend'),
    format = require('util').format,
    goa = require('goa'),
    joi = require('joi'),
    path = require('path'),
    reflekt = require('reflekt'),
    requireDirectory = require('require-directory');

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
    var modPath = modName.replace('.js', ''),
        mod;

    if (modPath.indexOf('.') === 0) {
        modPath = path.resolve(process.cwd(), modPath);
        mod = requireDirectory({ require: require }, modPath);
    } else {
        mod = require(modPath);
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
            throw new Error(format('Controller %s not defined!', name));
        }

        function handler(params, send) {
            reflekt.call(controller, extend(true, {}, resolver.items, {
                context: context,
                params: params,
                send: send
            }));
        }

        callback && callback(null, handler);
    };
}

function start(argv, config, callback) {
    var port = config.port || process.env.PORT || 3000,
        resolver = new reflekt.ObjectResolver({
            config: config,
            argv: argv,
            schema: joi
        }),
        app = goa(factory(resolver), { defaultAction: 'handle' }),
        caller = reflekt.caller(resolver);

    resolver.add('app', app);
    resolver.add('caller', caller);
    resolver.add('resolver', resolver);

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
            callback && callback(null, app);
        });
    });
}

extend(module.exports, {
    factory: factory,
    load:    load,
    start:   start
});
