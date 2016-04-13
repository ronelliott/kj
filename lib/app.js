'use strict';

const EventEmitter = require('events').EventEmitter,
      Request = require('./request'),
      Response = require('./response'),
      Router = require('./router'),
      async = require('async'),
      error = require('./error'),
      factory = require('./factory'),
      http = require('http'),
      inherits = require('util').inherits,
      is = require('is'),
      path = require('path'),
      reflekt = require('reflekt');

function App(options) {
    this.opts = options || {};
    this.caller = this.opts.caller || reflekt.caller(this.opts.context || {});
    this.error = this.opts.error || error;
    this.factory = this.opts.factory || factory;
    this.router = this.opts.router || new Router();
    this.slow = this.opts.slow || 3000;

    this.caller.resolver.remove([ 'caller', 'resolver' ]);
    this.caller.resolver.add({
        $$app: this,
        $$caller: this.caller,
        $$resolver: this.caller.resolver
    });
}

inherits(App, EventEmitter);

Object.assign(App.prototype, {
    handle: function(req, res, callback) {
        var self = this,
            slowTimer,
            $caller = reflekt.caller();

        $caller.resolver.remove([ 'caller', 'resolver' ]);
        $caller.resolver.add({
            $caller: $caller,
            $resolver: $caller.resolver,
            $$caller: this.caller,
            $$resolver: this.caller.resolver
        });

        if (!this.router) {
            throw new Error('Router not defined!');
        }

        this.emit('request:begin', req, res);

        $caller.resolver.add({
            req: req,
            res: res
        });

        var $req = $caller(Request),
            $res = $caller(Response);

        $caller.resolver.add({
            req: $req,
            $req: $req,
            $request: $req,
            res: $res,
            $res: $res,
            $response: $res
        });

        $res.on('finish', function() {
            self.emit('request:end', $req, $res);
        });

        if (is.int(this.slow)) {
            slowTimer = setTimeout(function () {
                self.emit('request:slow', $req, $res);
            }, self.slow);

            $res.on('close', function() {
                clearTimeout(slowTimer);
            });

            $res.on('finish', function() {
                clearTimeout(slowTimer);
            });
        }

        this.router.matches($req.meta.method, $req.meta.url,
            function(route, $params, done) {
                $req.meta.params = $params;
                self.process(route, $caller, $req, $res, done);
            }, function(err) {
                err = err || $caller.resolver('err');

                var augments = {
                    err: err,
                    $err: err,
                    $errs: $caller.resolver('$errs') || []
                };

                $caller.resolver.remove([ 'err', '$err', '$errs' ]);

                if (err && !(err.finished || $res.ended)) {
                    $caller(self.error, null, augments);
                }

                !$res.ended && $res.end();
                callback && $caller(callback, null, augments);
            });
    },

    initialize: function(modules, callback) {
        this.emit('app:init:begin', this);
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

                try {
                    self.caller(mod, null, resolutions);
                } catch(e) {
                    next(e);
                    return;
                }

                if (!hasCallback) {
                    next();
                }
            }, function(err) {
                self.emit('app:init:end', self);
                callback && callback(err);
            });

        return this;
    },

    process: function(route, $caller, $req, $res, done) {
        var $params = $req.meta.params,
            handler = route;

        if (is.object(handler) && handler.handler) {
            handler = handler.handler;
        }

        if (!is.function(handler)) {
            try {
                handler = this.caller(this.factory, null, {
                    $opts: handler,
                    $options: handler,
                    $caller: $caller,
                    $resolver: $caller.resolver
                });
            } catch(e) {
                done(e);
                return;
            }

            if (is.undefined(handler) || is.null(handler)) {
                done(new Error('Undefined handler for route: ' + route.path));
                return;
            }
        }

        var hasFinish = reflekt.has(handler, [ 'finish', '$finish' ], false),
            hasNext = reflekt.has(handler, [ 'next', '$next' ], false);

        $caller.resolver.add({
            finish: $finish,
            $finish: $finish,
            next: $next,
            $next: $next,
            $params: $params
        });

        try {
            $caller(handler);
        } catch(e) {
            $next(e);
            return;
        }

        if (!(hasNext || hasFinish)) {
            $next($res.ended ? { finished: true } : null);
            return;
        }

        var toRemove = [
            'finish',
            '$finish',
            'next',
            '$next',
            '$params'
        ];

        function addErr(err) {
            var $errs = $caller.resolver('$errs') || [];
            $errs.push(err);
            $caller.resolver.add({
                err: err,
                $err: err,
                $errs: $errs
            });
        }

        function $finish(err) {
            $caller.resolver.remove(toRemove);
            err && addErr(err);
            done(err || { finished: true });
        }

        function $next(err) {
            $caller.resolver.remove(toRemove);
            err && addErr(err);
            done();
        }
    },

    route: function() {
        return this.router.add.apply(this.router, arguments);
    },

    start: function(port, host, callback) {
        if (!port) {
            throw new Error('No port number given!');
        }

        if (isNaN(parseInt(port))) {
            throw new Error('Invalid port number!');
        }

        if (is.function(host) && is.undefined(callback)) {
            callback = host;
            host = null;
        }

        var hasCallback = is.function(callback);

        if (hasCallback) {
            var original = callback,
                self = this;
            callback = function() {
                self.emit('app:start', self, port, host);
                original.apply(this, arguments);
            }
        }

        this.server = http.createServer(this.handle.bind(this));
        this.server.listen(port, host, callback);
        !hasCallback && this.emit('app:start', self, port, host);
        return this;
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
