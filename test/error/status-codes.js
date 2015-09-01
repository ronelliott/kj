'use strict';

var should = require('should'),
    sinon = require('sinon'),
    error = require('../../lib/error');

describe('status codes', function() {
    beforeEach(function() {
        this.res = { status: sinon.spy(), write: sinon.spy() };
    });

    it('should set the status to "not found" if err.notFound is defined', function() {
        error({ notFound: true }, this.res);
        this.res.status.calledWith('not found').should.equal(true);
    });

    it('should set the status to "internal server error" if the status is 200', function() {
        error('woops!', this.res);
        this.res.status.calledWith('internal server error').should.equal(true);
    });
});
