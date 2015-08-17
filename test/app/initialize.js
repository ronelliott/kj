'use strict';

var App = require('../../lib/app'),
    should = require('should'),
    sinon = require('sinon');

describe('initialize', function() {
    beforeEach(function() {
        this.app = new App();
    });

    it('should allow functions to be passed directly', function(done) {
        var spy1 = sinon.spy(),
            spy2 = sinon.spy();

        this.app.initialize([ spy1, spy2 ], function(err) {
            should(err).not.be.ok();
            spy1.called.should.equal(true);
            spy2.called.should.equal(true);
            done();
        });
    });

    it('should abort if an error is pass in a callback', function(done) {
        var called = false,
            spy1 = function(callback) { called = true; callback('foo'); },
            spy2 = sinon.spy();

        this.app.initialize([ spy1, spy2 ], function(err) {
            err.should.equal('foo');
            called.should.equal(true);
            spy2.called.should.equal(false);
            done();
        });
    });

    it('should try to import modules passed as strings', function(done) {
        this.app.initialize([ 'test/app/spy' ], function(err) {
            should(err).not.be.ok();
            done();
        });
    });

    it('should throw an exception if it cannot import a module', function() {
        var self = this;
        (function() {
            self.app.initialize([ 'test/app/spy2' ]);
        }).should.throw(/Cannot find module/);
    });

    it('should call the function imported', function(done) {
        var self = this;
        this.app.initialize([ 'test/app/spy' ], function(err) {
            should(err).not.be.ok();
            self.app.caller.resolver('iz in ur resolver').should.equal(true);
            done();
        });
    });
});
