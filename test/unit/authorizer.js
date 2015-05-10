'use strict';

var Authorizer = require('../../lib/authorizer');

describe('Authorizer', function() {
    beforeEach(function() {
        this.authorizer = new Authorizer();
    });

    describe('can', function() {
        it('should call the callback with an error if authorizers do not exist for the given permission', function(done) {
            this.authorizer.can('ducks', function(err) {
                err.should.be.ok;
                err.should.have.property('notRegistered', ['ducks']);
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
