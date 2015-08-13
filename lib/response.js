'use strict';

var is = require('is'),
    status = require('http-status');

module.exports = function(res) {
    var original = res.end;
    res.end = function() {
        res.ended = true;
        return original.apply(res, arguments);
    };

    res.header = function(name, value) {
        if (arguments.length === 1) {
            return res.getHeader(name);
        }

        res.setHeader(name, value);
        return res;
    };

    res.redirect = function(path, status) {
        res.header('Location', path);
        res.status(status || 'found');
        res.end();
    };

    res.status = function(value) {
        if (arguments.length === 0) {
            return res.statusCode;
        }

        if (is.string(value)) {
            value = value.toUpperCase().replace(/ /g, '_');
            value = status[value];
        }

        res.statusCode = value;
        return res;
    };

    return res;
};
