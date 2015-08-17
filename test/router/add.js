'use strict';

var Router = require('../../lib/router'),
    pathToRegexp = require('path-to-regexp'),
    should = require('should'),
    sinon = require('sinon');

describe('add', function() {
    beforeEach(function() {
        this.router = new Router();
    });

    it('should add single handler routes correctly', function() {
        var h1 = sinon.spy(),
            h2 = sinon.spy();

        this.router.add('GET', '/', h1);

        this.router.routes.should.eql([{
            exp: pathToRegexp('/', []),
            handler: h1,
            keys: [],
            method: 'get',
            path: '/'
        }]);

        this.router.add('GET', '/foo', h2);

        this.router.routes.should.eql([{
            exp: pathToRegexp('/', []),
            handler: h1,
            keys: [],
            method: 'get',
            path: '/'
        }, {
            exp: pathToRegexp('/foo', []),
            handler: h2,
            keys: [],
            method: 'get',
            path: '/foo'
        }]);
    });

    it('should add multi handler routes correctly', function() {
        var h1 = sinon.spy(),
            h2 = sinon.spy();

        this.router.add('GET', '/', h1, h2);

        this.router.routes.should.eql([{
            exp: pathToRegexp('/', []),
            handler: h1,
            keys: [],
            method: 'get',
            path: '/'
        }, {
            exp: pathToRegexp('/', []),
            handler: h2,
            keys: [],
            method: 'get',
            path: '/'
        }]);
    });

    it('should allow overriding options', function() {
        var h1 = sinon.spy();

        this.router.add('GET', {
            end: false,
            url: '/'
        }, h1);

        this.router.routes.should.eql([{
            exp: pathToRegexp('/', [], { end: false }),
            handler: h1,
            keys: [],
            method: 'get',
            path: '/'
        }]);
    });
});
