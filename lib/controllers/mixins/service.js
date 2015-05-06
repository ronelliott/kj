'use strict';

var extend = require('extend'),
    format = require('util').format;

var ServiceMixin = {};

extend(ServiceMixin, {
    getService: function(params, resolver) {
        var name = this.getServiceName(params),
            service = resolver(name);

        if (typeof(service) === 'undefined') {
            throw new Error(format('No service named `%s` found!', name));
        }

        return service;
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
