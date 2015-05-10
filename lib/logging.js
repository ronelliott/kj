'use strict';

var extend = require('extend'),
    fmt = require('simple-fmt'),
    winston = require('winston');

function formatter(input, items) {
    return fmt.obj(input, items);
}

function get(name) {
    return winston.loggers.get(name);
}

function init(app, config) {
    Object.keys(config.loggers || {}).forEach(function (name) {
        var logger = config.loggers[name],
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

    var httpLoggingConfig = config.http || {},
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

extend(module.exports, {
    formatter: formatter,
    get: get,
    init: init
});
