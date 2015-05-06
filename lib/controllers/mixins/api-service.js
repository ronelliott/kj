'use strict';

var extend = require('extend'),
    format = require('util').format,
    reflekt = require('reflekt');

var ApiServiceMixin = {};

extend(ApiServiceMixin, {
    getHandler: function(params, values, caller) {
        var serviceName = caller(this.getServiceName, this),
            Service = caller(this.getService, this),
            service = new Service(this.context),
            methodName = params.service.method || params.method,
            method = service[methodName];

        if (!method) {
            throw new Error(format('Service `%s` has no method `%s`', serviceName, methodName));
        }

        function handler(params, json) {
            function callback(err, data) {
                if (err) {
                    var errors = err.message ? [ err.message ] : err.errors || [ 'Internal Server Error' ],
                        error = { errors: errors };
                    json(error, err.status || 500);
                    return;
                }

                json(data);
            }

            var items = extend(true, {}, {
                callback: callback,
                params: params,
                values: values
            }, values);
            try {
                reflekt.call(method, items, service);
            } catch(e) {
                callback(e);
            }
        }

        return handler;
    }
});

module.exports = ApiServiceMixin;
