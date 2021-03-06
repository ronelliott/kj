'use strict';

const is = require('is');

module.exports = function($$caller, $opts, $$resolver, $resolver) {
    var handler = $opts;

    if (is.object(handler) && handler.handler) {
        handler = $opts.handler;
    }

    if (is.string(handler)) {
        handler = $$resolver(handler) || $resolver(handler);
    }

    if (is.function(handler)) {
        return $$caller(handler, null, {
            $opts: $opts,
            $options: $opts
        });
    }
};
