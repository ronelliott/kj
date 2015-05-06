'use strict';

var extend = require('extend'),
    goa = require('goa'),
    joi = require('joi'),
    reflekt = require('reflekt');

function BaseController(context, log) {
    this.context = context;
    this.log = log;
}

extend(BaseController.prototype, {
    getHandler: function(params) {
        return this[params.method];
    },

    getResolutions: function(params, current, other) {
        return extend({}, this.context, current || {}, {
            params: params
        }, other || {});
    },

    handle: function(params, send) {
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
                self.log.error(err.toString());
                var errors = (err.details || []).map(function(detail) {
                    return {
                        field: detail.path,
                        message: detail.message,
                    };
                });
                json({
                    errors: errors,
                }, http.status.BAD_REQUEST);
                return;
            }

            var items = self.getResolutions(params, {
                    json: json,
                    render: render,
                    text: text,
                    values: values
                }),
                caller = reflekt.caller(items);
            items.caller = caller;

            var handler = caller(self.getHandler, self);
            caller(handler, self);
        });
    }
});

module.exports = BaseController;
