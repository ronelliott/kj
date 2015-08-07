'use strict';

var express = require('express'),
    expressWs = require('express-ws'),
    isFunc = require('./utils').isFunc,
    methods = require('methods');

function create(factory) {
    var app = express();
    expressWs(app);

    app.get('factory', function(params) {
        return params;
    });

    methods
        .concat([ 'all', 'ws' ])
        .forEach(function(method) {
            var original = app[method];
            app[method] = function(path) {
                if (method === 'get' && arguments.length === 1) {
                    return original.apply(this, arguments);
                }

                var args = [ path ];

                for (var idx = 1; idx < arguments.length; idx++) {
                    factory = factory || app.get('factory');

                    if (!factory) {
                        throw new Error('No factory defined!');
                    }

                    args.push(factory(arguments[idx]));
                }

                return original.apply(this, args);
            }
        });

    app.start = function start(port, callback) {
        app.set('port', port);
        app.listen(port, callback);
    };

    return app;
}

module.exports = create;
