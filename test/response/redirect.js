'use strict';

var Response = require('../../lib/response'),
    should = require('should'),
    sinon = require('sinon');

describe('redirect', function() {
    beforeEach(function () {
        this.end = sinon.spy();
        this.setHeader = sinon.spy();

        this.res = Response({
            end: this.end,
            setHeader: this.setHeader
        });
    });

    it('should set the location header', function() {
        this.res.redirect('/');
        this.setHeader.calledWith('Location', '/').should.equal(true);
    });

    it('should set the status code to `found` if no status was given', function() {
        this.res.redirect('/');
        this.res.statusCode.should.equal(302);
    });

    it('should set the status code to the given status', function() {
        this.res.redirect('/', 404);
        this.res.statusCode.should.equal(404);
    });

    it('should allow strings for the status', function() {
        this.res.redirect('/', 'not found');
        this.res.statusCode.should.equal(404);
    });

    it('should end the request', function() {
        this.res.redirect('/');
        this.end.called.should.equal(true);
        this.res.ended.should.equal(true);
    });
});
