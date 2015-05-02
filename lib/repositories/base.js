'use strict';

var extend = require('extend');

function BaseRepository() {}

extend(BaseRepository.prototype, {
    create: function(identifier, data, callback) {
        throw new Error('Not Implemented!');
    },

    delete: function(identifier, callback) {
        throw new Error('Not Implemented!');
    },

    done: function() {},

    find: function(query, callback) {
        throw new Error('Not Implemented!');
    },

    findOne: function(query, callback) {
        throw new Error('Not Implemented!');
    },

    get: function(identifier, callback) {
        throw new Error('Not Implemented!');
    },

    transact: function(callback) {
        throw new Error('Not Implemented!');
    },

    update: function(identifier, data, callback) {
        throw new Error('Not Implemented!');
    }
});

module.exports = BaseRepository;
