'use strict';

var Response = require('../../lib/response'),
    should = require('should'),
    sinon = require('sinon');

describe('json', function() {
    beforeEach(function () {
        this.setHeaderMock = sinon.spy();
        this.writeMock = sinon.spy();
        this.res = Response({ setHeader: this.setHeaderMock, write: this.writeMock });
    });

    it('should stringify values passed to it', function() {
        this.res.json({ foo: 'bar' });
        this.writeMock.calledWith(JSON.stringify({ foo: 'bar' })).should.equal(true);
    });

    it('should set the content type to "application/json"', function() {
        this.res.json({ foo: 'bar' });
        this.setHeaderMock.calledWith('Content-Type', 'application/json').should.equal(true);
    });
});
