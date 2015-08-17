'use strict';

var Router = require('../../lib/router'),
    should = require('should'),
    sinon = require('sinon');

describe('handle', function() {
    beforeEach(function() {
        this.router = new Router();
    });

    it('should handle basic routes correctly', function(done) {
        var h1 = sinon.spy(),
            h2 = sinon.spy();

        this.router.add('GET', '/', h1);
        this.router.add('GET', '/foo', h2);

        this.router.handle('GET', '/', function(route, params, next) {
            route.handler.should.equal(h1);
            next();
        }, done);
    });

    it('should process the middleware before the route handlers', function(done) {
        var h1 = sinon.spy(),
            h2 = sinon.spy(),
            i = 1;

        this.router.add('GET', '/', h1);
        this.router.use(h2);

        this.router.handle('GET', '/', function(route, params, next) {
            if (i === 1) {
                route.handler.should.equal(h2);
            }

            if (i === 2) {
                route.handler.should.equal(h1);
            }

            i++;
            next();
        }, done);
    });

    it('should call the callback with a notFound error if no routes were handled', function(done) {
        var spy = sinon.spy();
        this.router.handle('GET', '/', spy, function(err) {
            err.should.be.instanceOf(Object);
            err.should.have.property('notFound', true);
            spy.called.should.equal(false);
            done();
        });
    });

    it('should process `all` handlers', function(done) {
        var h1 = sinon.spy();

        this.router.add('*', '/', h1);

        this.router.handle('GET', '/', function(route, params, next) {
            route.handler.should.equal(h1);
            next();
        }, done);
    });

    it('should process `*` handlers', function(done) {
        var h1 = sinon.spy();

        this.router.add('*', '/', h1);

        this.router.handle('GET', '/', function(route, params, next) {
            route.handler.should.equal(h1);
            next();
        }, done);
    });

    it('should process not process handlers for other methods', function(done) {
        var h1 = sinon.spy(),
            h2 = sinon.spy();

        this.router.add('GET', '/', h1);
        this.router.add('POST', '/', h2);

        this.router.handle('GET', '/', function(route, params, next) {
            route.handler.should.equal(h1);
            next();
        }, done);
    });

    it('should parse out url keys', function(done) {
        var h1 = sinon.spy();

        this.router.add('GET', '/foo/:id', h1);

        this.router.handle('GET', '/foo/1', function(route, params, next) {
            route.handler.should.equal(h1);
            params.should.eql({ id: '1' });
            next();
        }, done);

    });
});
