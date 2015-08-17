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
});
