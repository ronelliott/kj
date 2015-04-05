'use strict';

var utils = require('./'),
    inject = utils.inject;

function init(config, winston) {
    winston = winston || require('winston');
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

            log[typeof(config.level) === 'function' ? config.level(req, res) : config.level](logStr);
        });

        next();
    };
}

module.exports = {
    init:        init,
    middleware:  middleware,
};
