'use strict';

var async = require('async'),
    extend = require('extend'),
    goa = require('goa'),
    reflekt = require('reflekt'),
    path = require('path');

extend(module.exports, {
    start: function(config, options, callback) {
        var app = goa(factory, { something: 'handle' }),
            resolver = new reflekt.ObjectResolver({
                app: app,
                config: config,
                options: options,
                get: get,
                del: del,
                post: post,
                put: put
            }),
            caller = reflekt.caller(resolver);

        resolver.add('caller', caller);
        resolver.add('resolver', resolver);

        async.eachSeries(config.init || [], function(initializer, next) {
            if (typeof(initializer) !== 'function') {
                initializer = initializer.replace('.js', '');

                if (initializer.indexOf('.') === 0) {
                    initializer = path.resolve(process.cwd(), initializer);
                }

                initializer = require(initializer);
            }

            reflekt.call(initializer, extend(true, {}, resolver.items, { callback: next }));
        }, function(err) {
            if (err) {
                callback(err);
                return;
            }

            var port = config.port || process.env.PORT || 3000;
            app.set('port', port);
            app.listen(port, function () {
                callback(null, app);
            });
        });

        function factory(name, context, callback) {
            name = name || 'BaseController';
            var Controller = resolver(name);

            if (!Controller) {
                var message = 'Controller named `' + name + '` not found! ' +
                    'Did you define a `controller` property on your route?';
                throw new Error(message);
            }

            callback(null, new Controller(context));
        }

        function get() {
            app.get.apply(app, arguments);
        }

        function del() {
            app.delete.apply(app, arguments);
        }

        function post() {
            app.post.apply(app, arguments);
        }

        function put() {
            app.put.apply(app, arguments);
        }
    }
});
