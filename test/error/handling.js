'use strict';

var should = require('should'),
    sinon = require('sinon'),
    error = require('../../lib/error');

describe('handling', function() {
    beforeEach(function() {
        this.res = { status: sinon.spy(), write: sinon.spy() };
    });

    it('write the error to the response', function() {
        error('woops!', this.res);
        this.res.write.calledWith('woops!').should.equal(true);
    });

    it('should stringify the error if an object is passed', function() {
        var err = { woops: true };
        error(err, this.res);
        this.res.write.calledWith(JSON.stringify(err)).should.equal(true);
    });
});
