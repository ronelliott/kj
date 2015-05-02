'use strict';

var should = require('should'),
    reflekt = require('reflekt'),
    CacheRepository = require('../../../lib/repositories/cache');

describe('CacheRepository', function() {
    beforeEach(function() {
        this.repo = new CacheRepository(reflekt.caller({}));
    });

    describe('done', function() {
        it('should be implemented', function() {
            var self = this;
            (function() {
                self.repo.done();
            }).should.not.throw('Not Implemented!');
        });
    });

    describe('find', function() {
        it('should not be implemented', function() {
            var self = this;
            (function() {
                self.repo.find();
            }).should.throw('Not Implemented!');
        });
    });

    describe('findOne', function() {
        it('should not be implemented', function() {
            var self = this;
            (function() {
                self.repo.findOne();
            }).should.throw('Not Implemented!');
        });
    });

    describe('transact', function() {
        it('should not be implemented', function() {
            var self = this;
            (function() {
                self.repo.transact();
            }).should.throw('Not Implemented!');
        });
    });
});
