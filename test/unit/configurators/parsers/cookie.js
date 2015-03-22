'use strict';

var should = require('should'),
    sinon = require('sinon'),
    doProxyquireTest = require('../../helpers/proxyquire').doProxyquireTest;

describe('Cookie', function() {
    it('should configure the cookie parser if it is enabled', function(done) {
        var config = { parsers: { cookie: { enabled: true, options: {} } } },
            app = { use: sinon.spy() },
            mocks = { 'cookie-parser': sinon.spy() },
            path = '../../../src/configurators/parsers/cookie';
        doProxyquireTest(path, mocks, function(configurator) {
            configurator.init(app, config);
            app.use.called.should.be.ok;
            mocks['cookie-parser'].called.should.be.ok;
            done();
        });
    });

    it('should not configure the cookie parser if it is not enabled', function(done) {
        var config = { parsers: { cookie: { enabled: false } } },
            app = { use: sinon.spy() },
            mocks = { 'cookie-parser': sinon.spy() },
            path = '../../../src/configurators/parsers/cookie';
        doProxyquireTest(path, mocks, function(configurator) {
            configurator.init(app, config);
            app.use.called.should.not.be.ok;
            mocks['cookie-parser'].called.should.not.be.ok;
            done();
        });
    });
});
