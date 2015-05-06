'use strict';

var extend = require('extend');

var ViewMixin = {};

extend(ViewMixin, {
    getContext: function(params) {
        return extend(true, {}, params.context, this.context, { config: this.config });
    },

    render: function(params, render) {
        var context = this.getContext(params);
        render(params.view || 'index', context);
    }
});

module.exports = ViewMixin;
