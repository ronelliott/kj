'use strict';

var Response = require('../../lib/response'),
    should = require('should'),
    sinon = require('sinon');

describe('headers', function() {
    beforeEach(function () {
        this.getHeader = sinon.spy(function(name) {
            return name;
        });

        this.setHeader = sinon.spy();

        this.res = Response({
            getHeader: this.getHeader,
            setHeader: this.setHeader
        });
    });

    it('should set all the headers in the array', function() {
        this.res.headers([ [ 'foo', 'bar' ] ]);
        this.setHeader.calledWith('foo', 'bar').should.equal(true);
    });

    it('should set all the headers in the object', function() {
        this.res.headers({
            foo: 'bar',
            bar: 'dar',
            dar: 'far'
        });

        this.setHeader.calledWith('foo', 'bar').should.equal(true);
        this.setHeader.calledWith('bar', 'dar').should.equal(true);
        this.setHeader.calledWith('dar', 'far').should.equal(true);
    });
});
