'use strict';

var should = require('should'),
    sinon = require('sinon'),
    MockLog = require('../mocks/log'),
    doProxyquireTest = require('../helpers/proxyquire').doProxyquireTest;

describe('CSRF', function() {
    it('should configure csrf if it is enabled', function(done) {
        var config = { csrf: { enabled: true } },
            log = MockLog(),
            app = { use: sinon.spy() },
            mocks = { csurf: sinon.spy() },
            path = '../../../src/configurators/csrf';
        doProxyquireTest(path, mocks, function(configurator) {
            configurator.init(app, config, log);
            app.use.called.should.be.ok;
            mocks.csurf.called.should.be.ok;
            done();
        });
    });

    it('should not configure csrf if it is not enabled', function(done) {
        var config = { csrf: { enabled: false } },
            log = MockLog(),
            app = { use: sinon.spy() },
            mocks = { csurf: sinon.spy() },
            path = '../../../src/configurators/csrf';
        doProxyquireTest(path, mocks, function(configurator) {
            configurator.init(app, config, log);
            app.use.called.should.not.be.ok;
            mocks.csurf.called.should.not.be.ok;
            done();
        });
    });
});
