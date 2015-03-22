'use strict';

var should = require('should'),
    CacheRepository = require('../../../src/repositories/cache').CacheRepository;

describe('CacheRepository', function() {
    describe('create', function() {
        it('should not be implemented', function() {
            var repository = new CacheRepository();
            (function() {
                repository.create();
            }).should.throw(/Not Implemented/);
        });
    });

    describe('delete', function() {
        it('should not be implemented', function() {
            var repository = new CacheRepository();
            (function() {
                repository.delete();
            }).should.throw(/Not Implemented/);
        });
    });

    describe('find', function() {
        it('should not be implemented', function() {
            var repository = new CacheRepository();
            (function() {
                repository.find();
            }).should.throw(/Not Implemented/);
        });
    });

    describe('get', function() {
        it('should not be implemented', function() {
            var repository = new CacheRepository();
            (function() {
                repository.get();
            }).should.throw(/Not Implemented/);
        });
    });

    describe('transact', function() {
        it('should not be implemented', function() {
            var repository = new CacheRepository();
            (function() {
                repository.transact();
            }).should.throw(/Not Implemented/);
        });
    });

    describe('update', function() {
        it('should not be implemented', function() {
            var repository = new CacheRepository();
            (function() {
                repository.update();
            }).should.throw(/Not Implemented/);
        });
    });
});
