'use strict';

var utils = require('../utils'),
    extend = utils.extend,
    inherits = utils.inherits,
    BaseController = require('./').BaseController;

function ViewController(context) {
    BaseController.call(this, context);
}

inherits(ViewController, BaseController);

ViewController.prototype = extend({}, BaseController.prototype, {
    getContext: function(params) {
        return params.context || this.context || {};
    },

    render: function(params, render) {
        render(params.view || 'index', this.getContext(params));
    },
});

module.exports = {
    ViewController: ViewController,
};
