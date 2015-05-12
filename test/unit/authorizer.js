'use strict';

var should = require('should'),
    reflekt = require('reflekt'),
    Authorizer = require('../../lib/authorizer').Authorizer;

describe('Authorizer', function() {
    beforeEach(function() {
        this.caller = new reflekt.caller({});
        this.authorizer = new Authorizer(this.caller);
    });

    describe('can', function() {
        it('should call the callback with an error if authorizers do not exist for the given permission', function(done) {
            this.authorizer.can('ducks', function(err) {
                err.should.be.ok;
                err.should.have.property('notDefined', 'ducks');
                done();
            });
        });

        it('should call the given callback with a result when roles are defined', function(done) {
            this.authorizer.use('ducks', function(callback) { callback(true); });
            this.authorizer.can('ducks', function(err, result) {
                should(err).not.be.ok;
                result.should.equal(true);
                done();
            });
        });

        it('should arrays to define roles', function(done) {
            this.authorizer.use('ducks', function(callback) { callback(true); });
            this.authorizer.use('mucks', [ 'ducks' ]);
            this.authorizer.can('mucks', function(err, result) {
                should(err).not.be.ok;
                result.should.equal(true);
                done();
            });
        });

        it('should return true if at least one permission check succeeds', function(done) {
            this.authorizer.use('ducks', function(callback) { callback(true); });
            this.authorizer.use('mucks', function(callback) { callback(false); });
            this.authorizer.use('wucks', function(callback) { callback(false); });
            this.authorizer.use('zucks', [ 'wucks', 'ducks', 'mucks' ]);
            this.authorizer.can('zucks', function(err, result) {
                should(err).not.be.ok;
                result.should.equal(true);
                done();
            });
        });

        it('should return false if at all permission checks fail', function(done) {
            this.authorizer.use('ducks', function(callback) { callback(false); });
            this.authorizer.use('mucks', function(callback) { callback(false); });
            this.authorizer.use('wucks', function(callback) { callback(false); });
            this.authorizer.use('zucks', [ 'wucks', 'ducks', 'mucks' ]);
            this.authorizer.can('zucks', function(err, result) {
                should(err).not.be.ok;
                result.should.equal(false);
                done();
            });
        });
    });

    describe('filter', function() {});

    describe('use', function() {
        it('should throw an error if registering an already defined permission', function() {
            var self = this;
            this.authorizer.use('ducks', []);
            (function() {
                self.authorizer.use('ducks', []);
            }).should.throw('Permission ducks already defined!');
        });
    });
});
