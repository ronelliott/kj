'use strict';

var should = require('should'),
    sinon = require('sinon'),
    MockLog = require('../mocks/log'),
    doProxyquireTest = require('../helpers/proxyquire').doProxyquireTest;

describe('Session', function() {
    it('should configure session if it is enabled', function(done) {
        var config = { session: { enabled: true } },
            log = MockLog(),
            app = { use: sinon.spy() },
            mocks = { 'express-session': sinon.spy() },
            path = '../../../src/configurators/session';
        doProxyquireTest(path, mocks, function(configurator) {
            configurator.init(app, config, log);
            app.use.called.should.be.ok;
            mocks['express-session'].called.should.be.ok;
            done();
        });
    });

    it('should not configure session if it is not enabled', function(done) {
        var config = { session: { enabled: false } },
            log = MockLog(),
            app = { use: sinon.spy() },
            mocks = { 'express-session': sinon.spy() },
            path = '../../../src/configurators/session';
        doProxyquireTest(path, mocks, function(configurator) {
            configurator.init(app, config, log);
            app.use.called.should.not.be.ok;
            mocks['express-session'].called.should.not.be.ok;
            done();
        });
    });
});
