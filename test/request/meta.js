'use strict';

var Request = require('../../lib/request'),
    should = require('should'),
    sinon = require('sinon');

describe('meta', function() {
    it('should set the request method in the meta object', function() {
        var req = Request({ method: 'GET', url: '/' });
        req.meta.method.should.equal('get');
    });

    it('should set the request url in the meta object', function() {
        var req = Request({ method: 'GET', url: '/' });
        req.meta.url.should.equal('/');
    });

    it('should split the querystring from the url if present', function() {
        var req = Request({ method: 'GET', url: '/?foo=bar' });
        req.meta.qs.should.equal('foo=bar');
        req.meta.url.should.equal('/');
    });
});
