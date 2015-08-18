'use strict';

var EventEmitter = require('events').EventEmitter,
    Request = require('./request'),
    Response = require('./response'),
    Router = require('./router'),
    async = require('async'),
    extend = require('extend'),
    http = require('http'),
    inherits = require('util').inherits,
    is = require('is'),
    path = require('path'),
    reflekt = require('reflekt');

function factory(caller, params) {
    var handler = params;

    if (is.object(handler)) {
        handler = params.handler;
    }

    if (is.string(handler)) {
        handler = caller.resolver(handler);
    }

    if (is.undefined(handler)) {
        throw new Error('Undefined handler: ' + JSON.stringify(params));
    }

    return caller(params.handler, null, {
        params: params
    });
}

function App(options) {
    this.opts = options || {};
    this.caller = this.opts.caller || reflekt.caller(this.opts.context || {});
    this.caller.resolver.add('app', this);
    this.factory = this.opts.factory || factory;
    this.router = this.opts.router || new Router();
    this.slow = this.opts.slow || 3000;
}

inherits(App, EventEmitter);

extend(App.prototype, {
    handle: function(req, res, callback) {
        var self = this,
            slowTimer;

        if (!this.router) {
            throw new Error('Router not defined!');
        }

        this.emit('request:begin', req, res);

        req.context = new reflekt.ObjectResolver();

        var resolutions = {
            ctx: req.context,
            context: req.context,
            req: req,
            request: req,
            res: res,
            response: res
        };

        req = this.caller(Request, null, resolutions);
        res = this.caller(Response, null, resolutions);

        res.on('finish', function() {
            self.emit('request:end', req, res);
        });

        if (is.int(this.slow)) {
            slowTimer = setTimeout(function () {
                self.emit('request:slow', req, res);
            }, self.slow);

            res.on('close', function() {
                clearTimeout(slowTimer);
            });

            res.on('finish', function() {
                clearTimeout(slowTimer);
            });
        }

        this.router.handle(req.meta.method, req.meta.url,
            function(route, params, next) {
                req.meta.params = params;
                var handler = route.handler;

                if (!is.function(handler)) {
                    if (is.string(handler)) {
                        handler = self.caller.resolver(handler);
                    }

                    if (is.undefined(handler) || is.null(handler)) {
                        next(new Error('Undefined handler for route: ' + route.path));
                        return;
                    }

                    if (!is.function(handler)) {
                        try {
                            handler = self.caller(self.factory, null, [
                                resolutions, {
                                    params: handler
                                }
                            ]);
                        } catch(e) {
                            next(e);
                            return;
                        }
                    }
                }

                var augments = {
                    finish: finish,
                    req: req,
                    res: res
                };

                var hasNext = reflekt.has(handler, 'next');

                if (hasNext) {
                    augments.next = next;
                }

                self.caller(handler, null, [
                    resolutions,
                    augments
                ]);

                if (!hasNext) {
                    next(res.ended ? { finished: true } : null);
                }

                function finish(err) {
                    next(err || { finished: true });
                }
            }, function(err) {
                if (err && !(err.finished || err.notFound || res.ended)) {
                    if ([ 200, null, undefined ].indexOf(res.status()) !== -1) {
                        res.status('internal server error');
                    }

                    if (is.object(err)) {
                        err = JSON.stringify(err);
                    }

                    res.write(err.toString());
                }

                err && err.notFound && res.status('not found');
                !res.ended && res.end();
                callback && self.caller(callback, null, [ resolutions, {
                    err: err
                }]);
            });
    },

    initialize: function(modules, callback) {
        var self = this;
        async.eachSeries(modules,
            function(mod, next) {
                if (is.string(mod)) {
                    if (mod.indexOf('.' + path.sep === 0)) {
                        mod = path.resolve(mod);
                    }

                    mod = require(mod);
                }

                var hasCallback = reflekt.has(mod, 'callback'),
                    resolutions = {};

                if (hasCallback) {
                    resolutions.callback = next;
                }

                self.caller(mod, null, resolutions);

                if (!hasCallback) {
                    next();
                }
            }, callback);
    },

    route: function() {
        return this.router.add.apply(this.router, arguments);
    },

    start: function(port) {
        if (!port) {
            throw new Error('No port number given!');
        }

        if (isNaN(parseInt(port))) {
            throw new Error('Invalid port number!');
        }

        this.server = http.createServer(this.handle.bind(this));
        return this.server.listen.apply(this.server, arguments);
    },

    unuse: function() {
        return this.router.unuse.apply(this.router, arguments);
    },

    use: function() {
        return this.router.use.apply(this.router, arguments);
    }
});

require('methods')
    .concat([ 'all' ])
    .forEach(function(method) {
        App.prototype[method] = function() {
            var args = [ method ].concat(Array.prototype.slice.apply(arguments));
            return this.route.apply(this, args);
        };
    });

module.exports = App;
