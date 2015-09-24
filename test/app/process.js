'use strict';

var App = require('../../lib/app'),
    should = require('should'),
    sinon = require('sinon'),
    reflekt = require('reflekt');

describe('process', function() {
    beforeEach(function() {
        this.app = new App();
        this.caller = reflekt.caller();
        this.req = { meta: {}, method: 'GET', url: '/' };
        this.res = { end: sinon.spy(), on: sinon.spy(), write: sinon.spy() };
    });

    it('should produce an error if the handler is not defined in the route', function(done) {
        this.app.process({ handler: null, path: '/' }, this.caller, this.req, this.res, function(err) {
            err.toString().should.equal('Error: Undefined handler for route: /');
            done();
        });
    });
});
