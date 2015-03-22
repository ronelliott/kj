'use strict';

var utils = require('../utils'),
    extend = utils.extend,
    inherits = utils.inherits,
    BaseController = require('./').BaseController,
    Services = require('../services');

function ServiceController(context) {
    BaseController.call(this, context);
}

inherits(ServiceController, BaseController);

ServiceController.prototype = extend({}, BaseController.prototype, {
    getService: function(params, working) {
        var name = this.getServiceName(params),
            services = Services.get(working);

        if (typeof(services[name]) === 'undefined') {
            throw new Error('No service named `' + name + '` found!');
        }

        return services[name];
    },

    getServiceName: function(params) {
        var name = params.service;

        if (typeof(name.name) !== 'undefined') {
            name = name.name;
        }

        // this could be better, we need to determine if Service is at the end
        // of the string instead of anywhere
        if (name.indexOf('Service') === -1) {
            name = name + 'Service';
        }

        return name;
    }
});

module.exports = {
    ServiceController: ServiceController,
};
