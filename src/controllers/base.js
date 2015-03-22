'use strict';

var utils = require('../utils'),
    app = utils.app,
    extend = utils.extend,
    inject = utils.inject,
    validation = utils.validation;

function BaseController(context) {
    this.context = context;
}

BaseController.prototype = {
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
            send(app.json.apply(app.json, arguments));
        }

        function render() {
            send(app.render.apply(app.render, arguments));
        }

        function text() {
            send(app.action.apply(app.action, arguments));
        }

        var self = this,
            validations = params.validation || {},
            values = Object.keys(validations).reduce(function(previous, field) {
                previous[field] = params[field];
                return previous;
            }, {});

        validation.validate(values, validation.object().keys(validations), function(err, values) {
            if (err) {
                throw new Error('Unable to validate inputs: ' + err);
            }

            var items = self.getResolutions(params, {
                    json: json,
                    render: render,
                    text: text,
                    values: values
                }),
                caller = inject.caller(items);
            items.caller = caller;

            var handler = caller(self.getHandler, self);
            caller(handler, self);
        });
    }
};

module.exports = {
    BaseController: BaseController,
};
