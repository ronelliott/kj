var utils = require('../utils'),
    extend = utils.extend,
    inherits = utils.inherits,
    inject = utils.inject,
    ServiceController = require('./').ServiceController;

function JSONServiceController(context) {
    ServiceController.call(this, context);
}

inherits(JSONServiceController, ServiceController);

JSONServiceController.prototype = extend({}, ServiceController.prototype, {
    getHandler: function(params, values, caller) {
        var serviceName = caller(this.getServiceName, this),
            Service = caller(this.getService, this),
            service = new Service(this.context),
            methodName = params.service.method || params.method,
            method = service[methodName];

        if (typeof(method) === 'undefined') {
            throw new Error('Service `' + serviceName + '` has no method `' + methodName + '`');
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
                values: values,
            }, values);
            try {
                inject.call(method, items, service);
            } catch(e) {
                callback(e);
            }
        }

        return handler;
    }
});

module.exports = {
    JSONServiceController: JSONServiceController,
};
