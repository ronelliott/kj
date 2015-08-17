'use strict';

var Response = require('../../lib/response'),
    should = require('should'),
    sinon = require('sinon');

describe('end', function() {
    beforeEach(function () {
        this.mock = sinon.spy();
        this.res = Response({ end: this.mock });
    });

    it('should mark the response as ended', function() {
        this.res.ended.should.equal(false);
        this.res.end();
        this.res.ended.should.equal(true);
    });

    it('should call the original end', function() {
        this.mock.called.should.equal(false);
        this.res.end();
        this.mock.called.should.equal(true);
    });
});
