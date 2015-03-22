'use strict';

var should = require('should'),
    sinon = require('sinon'),
    MockLog = require('../mocks/log'),
    doProxyquireTest = require('../helpers/proxyquire').doProxyquireTest;

describe('Helmet', function() {
    it('should configure helmet if it is enabled', function(done) {
        var config = { helmet: { enabled: true } },
            log = MockLog(),
            app = { use: sinon.spy() },
            mocks = { helmet: sinon.spy() },
            path = '../../../src/configurators/helmet';
        doProxyquireTest(path, mocks, function(configurator) {
            configurator.init(app, config, log);
            app.use.called.should.be.ok;
            mocks.helmet.called.should.be.ok;
            done();
        });
    });

    it('should not configure helmet if it is not enabled', function(done) {
        var config = { helmet: { enabled: false } },
            log = MockLog(),
            app = { use: sinon.spy() },
            mocks = { helmet: sinon.spy() },
            path = '../../../src/configurators/helmet';
        doProxyquireTest(path, mocks, function(configurator) {
            configurator.init(app, config, log);
            app.use.called.should.not.be.ok;
            mocks.helmet.called.should.not.be.ok;
            done();
        });
    });
});
