'use strict';

var App = require('../../lib/app'),
    should = require('should'),
    sinon = require('sinon');

describe('handle', function() {
    beforeEach(function() {
        this.app = new App();
        this.req = { method: 'GET', url: '/' };
        this.res = { end: sinon.spy(), on: sinon.spy(), write: sinon.spy() };
    });

    it('should set the status to 404 if no handler processed the request', function(done) {
        this.app.handle(this.req, this.res, function(res) {
            res.statusCode.should.equal(404);
            done();
        });
    });

    it('should abort the request chain if next is called in a handler with an error', function(done) {
        var called = false,
            h1 = function(next) { called = true; next('woops!'); },
            h2 = sinon.spy();

        this.app.get('/', h1, h2);
        this.app.handle(this.req, this.res, function(err) {
            err.should.equal('woops!');
            called.should.equal(true);
            h2.called.should.equal(false);
            done();
        });
    });

    it('should abort the request chain if finish is called in a handler', function(done) {
        var called = false,
            h1 = function(finish) { called = true; finish(); },
            h2 = sinon.spy();

        this.app.get('/', h1, h2);
        this.app.handle(this.req, this.res, function() {
            called.should.equal(true);
            h2.called.should.equal(false);
            done();
        });
    });

    it('should add a context to the request', function(done) {
        var called = false,
            h1 = function(ctx) { called = true; ctx.add('foo', 'bar'); };

        this.app.get('/', h1);
        this.app.handle(this.req, this.res, function(ctx) {
            ctx('foo').should.equal('bar');
            called.should.equal(true);
            done();
        });
    });
});
