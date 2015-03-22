'use strict';

function BaseRepository(options) {
    this.options = options || {};
}

BaseRepository.prototype = {
    create: function(identifier, data, callback) {
        throw new Error('Not Implemented!');
    },

    delete: function(identifier, callback) {
        throw new Error('Not Implemented!');
    },

    find: function(query, callback) {
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
    },
};

module.exports = {
    BaseRepository: BaseRepository,
};
