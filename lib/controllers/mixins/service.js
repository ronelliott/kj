'use strict';

var extend = require('extend'),
    format = require('util').format;

var ServiceMixin = {};

extend(ServiceMixin, {
    getService: function(params, working) {
        var name = this.getServiceName(params),
            services = Services.get(working);

        if (typeof(services[name]) === 'undefined') {
            throw new Error(format('No service named `%s` found!', name));
        }

        return services[name];
    },

    getServiceName: function(params) {
        var name = params.service;

        if (typeof(name.name) !== 'undefined') {
            name = name.name;
        }

        if (name.indexOf('Service') === -1) {
            name = name + 'Service';
        }

        return name;
    }
});

module.exports = ServiceMixin;
