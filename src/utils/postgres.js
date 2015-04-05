'use strict';

var pg;

function connect(config, callback) {
    pg = pg || require('pg');
    pg.connect(config.postgres.host, function(err, client, done) {
        if(err) {
            callback && callback(err);
            return;
        }

        callback && callback(err, client, done);
    });
}

function query(query, client, callback, log) {
    pg = pg || require('pg');
    log && log(query);
    client.query(query, function(err, result) {
        if (err) {
            callback && callback(err);
            return;
        }

        callback && callback(err, result.rows);
    });
}

function transaction(client, callback, log) {
    pg = pg || require('pg');
    function commit(callback) {
        query('COMMIT;', client, callback, log);
    }

    function rollback(callback) {
        query('ROLLBACK;', client, callback, log);
    }

    query('BEGIN;', client, function(err) {
        if (err) {
            rollback(function() { callback && callback(err); });
            return;
        }

        callback && callback(commit, rollback);
    }, log);
}

module.exports = {
    connect: connect,
    query: query,
    transaction: transaction,
};
