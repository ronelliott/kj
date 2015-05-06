'use strict';

var extend = require('extend'),
    inherits = require('util').inherits,
    ServiceController = require('./service'),
    ApiServiceMixin = require('./mixins').ApiServiceMixin;

function ApiServiceController(caller) {
    caller(ServiceController, this);
}

inherits(ApiServiceController, ServiceController);

extend(ApiServiceController.prototype, ApiServiceMixin);

module.exports = ApiServiceController;
