'use strict';

module.exports = function(req) {
    var meta = req.meta || {};
    meta.url = req.url;

    var idx = meta.url.indexOf('?');
    if (idx > 0) {
        meta.qs = meta.url.slice(idx + 1);
        meta.url = meta.url.slice(0, idx);
    }

    meta.method = req.method.toLowerCase();

    req.header = function(name) {
        return req.headers[name];
    };

    req.meta = meta;
    return req;
};
