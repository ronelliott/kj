'use strict';

var utils = require('../utils'),
    extend = utils.extend,
    inherits = utils.inherits,
    BaseRepository = require('./').BaseRepository;

function CacheRepository(options) {
    BaseRepository.call(this, options);
}

inherits(CacheRepository, BaseRepository);

CacheRepository.prototype = extend({}, BaseRepository.prototype, {
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
    },
});

module.exports = {
    CacheRepository: CacheRepository,
};
