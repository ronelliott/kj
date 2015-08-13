'use strict';

var Router = require('../../lib/router'),
    should = require('should'),
    sinon = require('sinon');

describe('use', function() {
    beforeEach(function() {
        this.router = new Router();
    });

    it('should add middleware correctly', function() {
        var h1 = sinon.spy(),
            h2 = sinon.spy();

        this.router.use(h1);

        this.router.middleware.should.eql([{
            handler: h1
        }]);

        this.router.use(h2);

        this.router.middleware.should.eql([{
            handler: h1
        }, {
            handler: h2
        }]);
    });
});
