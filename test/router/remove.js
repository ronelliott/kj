'use strict';

var Router = require('../../lib/router'),
    pathToRegexp = require('path-to-regexp'),
    should = require('should'),
    sinon = require('sinon');

describe('remove', function() {
    beforeEach(function() {
        this.router = new Router();
    });

    it('should remove routes correctly', function() {
        var h1 = sinon.spy(),
            h2 = sinon.spy();

        this.router.add('GET', '/', h1);
        this.router.add('GET', '/', h2);

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

        this.router.remove('GET', '/', h2);

        this.router.routes.should.eql([{
            exp: pathToRegexp('/', []),
            handler: h1,
            keys: [],
            method: 'get',
            path: '/'
        }]);
    });
});
