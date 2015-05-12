'use strict';

var async = require('async'),
    extend = require('extend'),
    fmt = require('simple-fmt'),
    isArray = require('util').isArray;

function Authorizer(caller) {
    this.caller = caller;
    this.permissions = {};
}

extend(Authorizer.prototype, {
    can: function(permission, callback) {
        var self = this,
            permissions = this.permissions[permission];

        if (!permissions) {
            callback({ notDefined: permission });
            return;
        }

        async.some(permissions,
            function(permission, next) {
                if (typeof(permission) === 'string') {
                    self.can(permission, function(err, result) {
                        if (err) {
                            callback(err);
                            return;
                        }

                        next(result);
                    });
                    return;
                }

                self.caller.resolver.add('callback', next);
                self.caller(permission, next);
            }, function(result) {
                callback(null, result);
            });
    },

    filter: function(permission, items, callback) {
        async.filter(items, this.can.bind(this), callback);
    },

    use: function(permission, permissions) {
        if (this.permissions[permission]) {
            throw new Error(fmt('Permission {0} already defined!', permission));
        }

        this.permissions[permission] = isArray(permissions) ? permissions : [ permissions ];
        return this;
    }
});

extend(module.exports, {
    Authorizer: Authorizer
});
