'use strict';

var extend = require('extend'),
    inherits = require('util').inherits,
    BaseController = require('./base'),
    ServiceMixin = require('./mixins').ServiceMixin;

function ServiceController(caller) {
    caller(BaseController, this);
}

inherits(ServiceController, BaseController);

extend(ServiceController.prototype, ServiceMixin);

module.exports = ServiceController;
