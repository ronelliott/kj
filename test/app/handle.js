'use strict';

var App = require('../../lib/app'),
    EventEmitter = require('events').EventEmitter,
    should = require('should'),
    sinon = require('sinon');

describe('handle', function() {
    beforeEach(function() {
        this.app = new App();
        this.req = { method: 'GET', url: '/' };
        this.res = { end: sinon.spy(), on: sinon.spy(), write: sinon.spy() };
    });

    it('should throw an error if no router is defined', function() {
        var self = this;
        this.app.router = null;
        (function() {
            self.app.handle();
        }).should.throw('Router not defined!');
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

    it('should set the status to 500 if the status is 200 when a handler passes an error to next', function(done) {
        var self = this,
            called = false,
            h1 = function(next) { called = true; next('woops!'); },
            h2 = sinon.spy();

        this.app.get('/', h1, h2);
        this.app.handle(this.req, this.res, function(err) {
            err.should.equal('woops!');
            called.should.equal(true);
            h2.called.should.equal(false);
            self.res.statusCode.should.equal(500);
            done();
        });
    });

    it('should stringify the object if next is called in a handler with an object', function(done) {
        var called = false,
            h1 = function(next) { called = true; next({ woops: true }); },
            h2 = sinon.spy();

        this.app.get('/', h1, h2);
        this.app.handle(this.req, this.res, function(err) {
            err.should.equal('{"woops":true}');
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

    it('should resolve the handler if it is a string', function(done) {
        var h1 = sinon.spy();

        this.app.caller.resolver.add('foo', h1);
        this.app.get('/', 'foo');
        this.app.handle(this.req, this.res, function() {
            h1.called.should.equal(true);
            done();
        });
    });

    it('should resolve the handler if it is an object', function(done) {
        var h1 = sinon.spy();

        this.app.caller.resolver.add('foo', h1);
        this.app.get('/', { handler: 'foo' });
        this.app.handle(this.req, this.res, function() {
            h1.called.should.equal(true);
            done();
        });
    });

    it('should return an error if the handler is not defined in the route', function(done) {
        this.app.get('/', null);
        this.app.handle(this.req, this.res, function(err) {
            err.toString().should.equal('Error: Undefined handler for route: /');
            done();
        });
    });

    it('should return an error if the handler is not defined in the resolver', function(done) {
        this.app.get('/', { handler: 'foo' });
        this.app.handle(this.req, this.res, function(err) {
            err.toString().should.equal('Error: Undefined handler: {"handler":"foo"}');
            done();
        });
    });

    it('should emit a `request:begin` signal at the start of the request', function(done) {
        var h1 = sinon.spy(),
            fired = sinon.spy(function() { h1.called.should.equal(false); });

        this.app.use(h1);
        this.app.on('request:begin', fired);
        this.app.handle(this.req, this.res, function() {
            fired.called.should.equal(true);
            h1.called.should.equal(true);
            done();
        });
    });

    it('should emit a `request:end` signal at the end of the request', function(done) {
        var h1 = sinon.spy(),
            fired = sinon.spy(function() { h1.called.should.equal(true); }),
            res = new EventEmitter();

        res.end = sinon.spy(function() { res.emit('finish'); });
        res.write = sinon.spy();
        this.app.use(h1);
        this.app.on('request:end', fired);
        this.app.handle(this.req, res, function() {
            fired.called.should.equal(true);
            done();
        });
    });

    it('should emit a `request:slow` signal if the slow option is set to an integer', function(done) {
        var called = false,
            h1 = function(next) { called = true; setTimeout(next, 150); },
            fired = sinon.spy();

        this.app.slow = 50;
        this.app.get('/', h1);
        this.app.on('request:slow', fired);
        this.app.handle(this.req, this.res, function() {
            fired.called.should.equal(true);
            called.should.equal(true);
            done();
        });
    });

    it('should not emit a `request:slow` signal if the slow option is set to null', function(done) {
        var called = false,
            h1 = function(next) { called = true; setTimeout(next, 150); },
            fired = sinon.spy();

        this.app.slow = null;
        this.app.get('/', h1);
        this.app.on('request:slow', fired);
        this.app.handle(this.req, this.res, function() {
            fired.called.should.equal(false);
            called.should.equal(true);
            done();
        });
    });

    it('should clear the slow handler timeout if the response is closed', function(done) {
        var called = false,
            h1 = function(next) { called = true; setTimeout(next, 150); },
            fired = sinon.spy(),
            res = new EventEmitter();

        res.end = sinon.spy(function() { res.emit('finish'); });
        res.write = sinon.spy();
        this.app.slow = 50;
        this.app.get('/', h1);
        this.app.on('request:slow', fired);
        this.app.handle(this.req, res, function() {
            fired.called.should.equal(false);
            called.should.equal(true);
            done();
        });
        res.emit('close');
    });

    it('should clear the slow handler timeout if the response is finished', function(done) {
        var called = false,
            h1 = function(next) { called = true; setTimeout(next, 150); },
            fired = sinon.spy(),
            res = new EventEmitter();

        res.end = sinon.spy(function() { res.emit('finish'); });
        res.write = sinon.spy();
        this.app.slow = 50;
        this.app.get('/', h1);
        this.app.on('request:slow', fired);
        this.app.handle(this.req, res, function() {
            fired.called.should.equal(false);
            called.should.equal(true);
            done();
        });
        res.emit('finish');
    });
});
