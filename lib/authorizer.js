'use strict';

var async = require('async'),
    extend = require('extend'),
    fmt = require('simple-fmt');

function Authorizer() {
    this.authorizers = {};
}

extend(Authorizer.prototype, {
    can: function(permission, callback) {
        var authorizers = this.authorizers[permission];

        if (!authorizers) {
            callback({ notRegistered: [ permission ] });
            return;
        }

        async.eachSeries(authorizers, function(authorizer, next) {

        }, callback);
    },

    filter: function(permission, items, callback) {},

    use: function(permission, authorizers) {
        if (this.authorizers[permission]) {
            throw new Error(fmt('Permission {0} already defined!', permission));
        }

        this.authorizers[permission] = authorizers;
        return this;
    }
});

module.exports = Authorizer;
