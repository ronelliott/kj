'use strict';

var async = require('async'),
    kj = require('./'),
    reflekt = require('reflekt'),
    pth = require('path'),
    utils = require('./utils');

function run(config, callback) {
    var app = kj.app(),
        caller = reflekt.caller({ app: app, config: config });

    function doCall(mod, next) {
        var hasCallback = reflekt.has(mod, 'callback');

        if (hasCallback) {
            caller.resolver.add('callback', next, 1);
        }

        caller(mod);

        if (!hasCallback) {
            next();
        }
    }

    function initialize(next) {
        async.eachSeries(config.modules || [],
            function(name, next) {
                try {
                    var mod = name;

                    if (utils.isString(mod)) {
                        try {
                            mod = require(pth.resolve(mod));
                        } catch(e) {
                            next(e);
                            return;
                        }
                    }

                    if (utils.isFunc(mod)) {
                        doCall(mod, next);
                    }

                    if (utils.isObject(mod)) {
                        async.eachSeries(config.submodules || Object.keys(mod),
                            function(name, next) {
                                var submod = mod[name];

                                if (!submod) {
                                    next();
                                    return;
                                }

                                doCall(submod, next);
                            }, next);
                    }
                } catch(e) {
                    if (e.code !== 'MODULE_NOT_FOUND') {
                        next(e);
                    }
                }
            }, next);
    }

    function start(next) {
        app.start(config.port, next);
    }

    async.series([
        initialize,
        start
    ], callback);
}
run.description = 'Run the server.';

module.exports.run = run;
