'use strict';

var winston = require('winston'),
    utils = require('./'),
    inject = utils.inject;

function get(name) {
    return winston.loggers.get(name);
}

function init(config) {
    Object.keys(config).forEach(function(name) {
        winston.loggers.add(name, config[name]);
    });
}

function middleware(config, log) {
    return function middleware(req, res, next) {
        var start = Date.now();

        res.on('finish', function() {
            var elapsed = new Date() - start,
                logStr = inject.call(config.formatter, {
                    method: req.method,
                    req: req,
                    res: res,
                    start: start,
                    elapsed: elapsed,
                    status: res.statusCode,
                    separator: ' - ',
                    url: req.url,
                });

            log[config.level](logStr);
        });

        next();
    };
}

module.exports = {
    get:         get,
    init:        init,
    middleware:  middleware,
};
