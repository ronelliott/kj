'use strict';

var async = require('async'),
    extend = require('extend'),
    fmt = require('simple-fmt'),
    isArray = require('util').isArray;

function Authorizer(caller) {
    this.authorizers = {};
    this.caller = caller;
}

extend(Authorizer.prototype, {
    can: function(permission, callback) {
        var authorizers = this.authorizers[permission];

        if (!authorizers) {
            callback({ notRegistered: permission });
            return;
        }

        async.some(authorizers,
            function(authorizer, next) {
                next(false);
            }, function(result) {
                callback(null, result);
            });
    },

    filter: function(permission, items, callback) {
        var self = this;

        async.filter(items,
            function(item, next) {
                self.can(permission, next);
            }, callback);
    },

    use: function(permission, authorizers) {
        if (this.authorizers[permission]) {
            throw new Error(fmt('Permission {0} already defined!', permission));
        }

        this.authorizers[permission] = isArray(authorizers) ? authorizers : [ authorizers ];
        return this;
    }
});

extend(module.exports, {
    Authorizer: Authorizer
});
