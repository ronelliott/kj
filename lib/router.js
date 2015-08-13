'use strict';

var async = require('async'),
    extend = require('extend'),
    is = require('is'),
    pathToRegexp = require('path-to-regexp');

function Router(options) {
    this.options = options || {};
    this.middleware = [];
    this.routes = [];
}

extend(Router.prototype, {
    add: function(method, path, handler) {
        var self = this;

        if (arguments.length > 3) {
            var args = Array.prototype.slice.call(arguments, 2);

            args.forEach(function(handler) {
                self.routes.push(self.make(method, path, handler));
            });

            return;
        }

        this.routes.push(this.make(method, path, handler));
    },

    handle: function(method, url, each, callback) {
        method = method.toLowerCase();
        var self = this;

        async.series([
            middleware,
            routes
        ], callback);

        function middleware(done) {
            async.eachSeries(self.middleware, function(middlware, next) {
                each(middlware, null, next);
            }, done);
        }

        function routes(done) {
            async.eachSeries(self.routes,
                function(route, next) {
                    if ([ 'all', method ].indexOf(route.method) < 0) {
                        next();
                        return;
                    }

                    var match = route.exp.exec(url);

                    if (match !== null) {
                        var params = {};

                        for (var i = 1; i < match.length; i++) {
                            params[route.keys[i - 1].name] = match[i];
                        }

                        each(route, params, next);
                        return;
                    }

                    next();
                }, done);
        }
    },

    make: function(method, path, handler) {
        var opts = { end: true, strict: false, sensitive: false };

        if (is.object(path)) {
            opts = extend(opts, path);
            path = opts.url;
        }

        var keys = [],
            exp = pathToRegexp(path, keys, opts);

        return {
            exp: exp,
            keys: keys,
            handler: handler,
            method: method.toLowerCase(),
            path: path
        };
    },

    remove: function(method, path, handler) {
        method = method.toLowerCase();
        this.routes = this.routes.filter(function(route) {
            var isMatch = route.method === method;

            if (path) {
                isMatch = isMatch && route.path === path;
            }

            if (handler) {
                isMatch = isMatch && route.handler === handler;
            }

            return !isMatch;
        });
    },

    unuse: function(handler) {
        this.middleware = this.middleware.filter(function(middleware) {
            return middleware.handler !== handler;
        });
    },

    use: function(handler) {
        this.middleware.push({
            handler: handler
        });
    }
});

module.exports = Router;