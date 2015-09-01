'use strict';

var is = require('is');

module.exports = function($$caller, $opts, $resolver) {
    var handler = $opts;

    if (is.object(handler) && handler.handler) {
        handler = $opts.handler;
    }

    if (is.string(handler)) {
        handler = $$caller.resolver(handler) || $resolver(handler);
    }

    if (is.function(handler)) {
        return $$caller(handler, null, {
            $opts: $opts,
            $options: $opts
        });
    }
};
