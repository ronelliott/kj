'use strict';

var extend = require('extend'),
    inherits = require('util').inherits,
    BaseController = require('./base'),
    ViewMixin = require('./mixins').ViewMixin;

function ViewController(caller) {
    caller(BaseController, this);
}

inherits(ViewController, BaseController);

extend(ViewController.prototype, ViewMixin);

module.exports = ViewController;
