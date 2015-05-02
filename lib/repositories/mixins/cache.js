'use strict';

var extend = require('extend');

var CacheMixin = {};

extend(CacheMixin, {
    create: function(identifier, data, callback) {
        var self = this;
        this.transact(function create(client) {
            client.set(self.identifier(identifier), data.toString(), callback);
        });
    },

    delete: function(identifier, callback) {
        var self = this;
        this.transact(function create(client) {
            client.del(self.identifier(identifier), callback);
        });
    },

    get: function(identifier, callback) {
        var self = this;
        this.transact(function create(client) {
            client.get(self.identifier(identifier), callback);
        });
    },

    identifier: function(identifier) {
        return identifier;
    },

    update: function(identifier, data, callback) {
        this.create.apply(this, arguments);
    }
});

module.exports = CacheMixin;
