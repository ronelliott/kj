'use strict';

var extend = require('extend');

var ViewMixin = {};

extend(ViewMixin, {
    getContext: function(params) {
        return params.context || this.context || {};
    },

    render: function(params, render) {
        render(params.view || 'index', this.getContext(params));
    }
});

module.exports = ViewMixin;
