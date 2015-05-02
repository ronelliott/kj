'use strict';

var should = require('should'),
    BaseRepository = require('../../../lib/repositories/base');

describe('BaseRepository', function() {
    beforeEach(function() {
        this.repo = new BaseRepository();
    });

    describe('create', function() {
        it('should not be implemented', function() {
            var self = this;
            (function() {
                self.repo.create();
            }).should.throw('Not Implemented!');
        });
    });

    describe('delete', function() {
        it('should not be implemented', function() {
            var self = this;
            (function() {
                self.repo.delete();
            }).should.throw('Not Implemented!');
        });
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

    describe('get', function() {
        it('should not be implemented', function() {
            var self = this;
            (function() {
                self.repo.get();
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

    describe('update', function() {
        it('should not be implemented', function() {
            var self = this;
            (function() {
                self.repo.update();
            }).should.throw('Not Implemented!');
        });
    });
});
