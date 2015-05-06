'use strict';

var extend = require('extend'),
    goa = require('goa'),
    joi = require('joi'),
    reflekt = require('reflekt');

function BaseController(config, context, log, resolver) {
    this.config = config;
    this.context = context;
    this.log = log;
    this.resolver = resolver;
}

extend(BaseController.prototype, {
    getHandler: function(params) {
        return this[params.method];
    },

    handle: function(params, send) {
        var caller = reflekt.caller(extend(true, {}, this.resolver.items));
        caller.resolver.add('caller', caller);
        caller.resolver.add('resolver', caller.resolver);
        caller.resolver.add('params', params);
        caller.resolver.add('send', send);

        function json() {
            send(goa.json.apply(goa.json, arguments));
        }

        function render() {
            send(goa.view.apply(goa.view, arguments));
        }

        function text() {
            send(goa.action.apply(goa.action, arguments));
        }

        var self = this,
            validations = params.validation || {},
            values = Object.keys(validations).reduce(function(previous, field) {
                previous[field] = params[field];
                return previous;
            }, {});

        joi.validate(values, joi.object().keys(validations), function(err, values) {
            if (err) {
                send(err);
                return;
            }

            caller.resolver.add('json', json);
            caller.resolver.add('render', render);
            caller.resolver.add('text', text);
            caller.resolver.add('values', values);

            var handler = caller(self.getHandler, self);
            caller(handler, self);
        });
    }
});

module.exports = BaseController;
