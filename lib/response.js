'use strict';

const httpStatus = require('http-status'),
      is = require('is');

module.exports = function(res) {
    var original = res.end;
    res.ended = false;
    res.end = function() {
        res.ended = true;
        return original.apply(res, arguments);
    };

    res.header = function(name, value) {
        if (arguments.length === 1 && is.string(name)) {
            return res.getHeader(name);
        }

        if (is.array(name)) {
            value = name[1];
            name = name[0];
        }

        if (is.object(name)) {
            value = name.value;
            name = name.name;
        }

        res.setHeader(name, value);
        return res;
    };

    res.headers = function(headers) {
        if (is.array(headers)) {
            headers
                .forEach(res.header);
        }

        if (is.object(headers)) {
            Object
                .keys(headers)
                .forEach(function(name) {
                    res.header(name, headers[name]);
                });
        }

        return res;
    };

    res.json = function(value) {
        res.header('Content-Type', 'application/json');
        res.write(JSON.stringify(value));
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
            value = httpStatus[value];
        }

        res.statusCode = value;
        return res;
    };

    return res;
};
