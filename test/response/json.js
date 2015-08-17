'use strict';

var Response = require('../../lib/response'),
    should = require('should'),
    sinon = require('sinon');

describe('json', function() {
    beforeEach(function () {
        this.mock = sinon.spy();
        this.res = Response({ write: this.mock });
    });

    it('should stringify values passed to it', function() {
        this.res.json({ foo: 'bar' });
        this.mock.calledWith(JSON.stringify({ foo: 'bar' })).should.equal(true);
    });
});
