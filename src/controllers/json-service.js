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
                    var errors = err.errors || [ { message: err.toString().replace(/^(E|e)rror(:\s*)?/, '') } ],
                        status = err.status || 500;
                    json({ errors: errors }, status);
                    return;
                }

                json(data);
            }

            var items = extend(true, {}, { callback: callback }, values);
            inject.call(method, items, service);
        }

        return handler;
    }
});

module.exports = {
    JSONServiceController: JSONServiceController,
};
