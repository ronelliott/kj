'use strict';

var utils = require('../utils'),
    extend = utils.extend,
    inherits = utils.inherits,
    BaseRepository = require('./').BaseRepository,
    postgres = utils.postgres,
    squel;

function requireSquel() {
    return require('squel').useFlavour('postgres');
}

function PostgresRepository(context, tableName, identifier) {
    BaseRepository.call(this, context);
    this.tableName = tableName || context.args.tableName;
    this.identifier = identifier || context.config.postgres.identifier || context.args.identifier || 'id';
}

inherits(PostgresRepository, BaseRepository);

PostgresRepository.prototype = extend({}, BaseRepository.prototype, {
    connect: function(callback) {
        if (!this.client) {
            var self = this;
            postgres.connect(this.options.config, function(err, client, done) {
                self.client = client;
                self.done = done;
                callback();
            });
        } else {
            callback();
        }
    },

    create: function(data, callback) {
        squel = squel || requireSquel();
        var q = squel
            .insert()
            .into(this.tableName);

        Object.keys(data).forEach(function(field) {
            var value = data[field];

            if (typeof(value) === 'object') {
                value = JSON.stringify(value);
            }

            q.set(field, value);
        });

        this.query(q.toString(), callback);
    },

    delete: function(identifier, callback) {
        squel = squel || requireSquel();
        var q = squel
            .delete()
            .from(this.tableName)
            .where(this.identifier + ' = ?', identifier);

        this.query(q.toString(), callback);
    },

    find: function(query, callback) {
        squel = squel || requireSquel();
        var q = squel
            .select()
            .from(this.tableName);

        Object.keys(query).forEach(function(field) {
            var value = query[field];

            if (field === 'limit') {
                q.limit(value);
            } else {
                q.where(field + ' = ?', value);
            }
        });

        this.query(q.toString(), callback);
    },

    findOne: function(query, callback) {
        query.limit = 1;
        this.find(query, function(err, result) {
            if (!err && result.length > -1) {
                result = result[0];
            }

            callback(err, result);
        });
    },

    finish: function() {
        this.done();
    },

    get: function(identifier, callback) {
        var field = this.identifier,
            q = {};
        q[field] = identifier;
        this.findOne(q, callback);
    },

    query: function(q, callback) {
        var self = this;
        this.connect(function() {
            postgres.query(q, self.client, callback, self.options.log.debug);
        });
    },

    transact: function(callback) {
        var self = this;
        this.connect(function() {
            postgres.transaction(self.client, callback);
        });
    },

    update: function(identifier, data, callback) {
        squel = squel || requireSquel();
        var q = squel
            .update()
            .table(this.tableName)
            .where(this.identifier + ' = ?', identifier);

        Object.keys(data).forEach(function(field) {
            var value = data[field];

            if (typeof(value) === 'object') {
                value = JSON.stringify(value);
            }

            q.set(field, value);
        });

        this.query(q.toString(), callback);
    },
});

module.exports = {
    PostgresRepository: PostgresRepository,
};
