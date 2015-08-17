'use strict';

var Response = require('../../lib/response'),
    should = require('should'),
    sinon = require('sinon');

describe('header', function() {
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

    it('should return the header value if no value is given', function() {
        this.res.header('foo').should.equal('foo');
    });
    
    it('should set the header value if a value is given', function() {
        this.res.header('foo', 'bar');
        this.setHeader.calledWith('foo', 'bar').should.equal(true);
    });
});
