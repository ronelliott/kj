'use strict';

var extend = require('extend'),
    format = require('util').format;

var CrudMixin = {};

extend(CrudMixin, {
    create: function(values, callback) {
        var self = this;
        this.repo.create(values, function() {
            self.repo.done();
            callback.apply(callback, arguments);
        });
    },

    delete: function(id, callback) {
        var self = this;
        this.repo.delete(id, function() {
            self.repo.done();
            callback.apply(callback, arguments);
        });
    },

    get: function(id, callback) {
        var self = this;
        this.repo.get(id, function() {
            self.repo.done();
            callback.apply(callback, arguments);
        });
    },

    list: function(callback) {
        var self = this;
        this.repo.find(function() {
            self.repo.done();
            callback.apply(callback, arguments);
        });
    },

    update: function(id, values, callback) {
        var self = this;
        this.repo.update(id, values, function() {
            self.repo.done();
            callback.apply(callback, arguments);
        });
    }
});

module.exports = CrudMixin;
