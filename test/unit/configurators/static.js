'use strict';

var should = require('should'),
    sinon = require('sinon'),
    MockLog = require('../mocks/log'),
    doProxyquireTest = require('../helpers/proxyquire').doProxyquireTest;

describe('Static', function() {
    it('should configure the static handler if it is enabled', function(done) {
        var config = { static: { enabled: true, options: { path: '.', url: '/foo' } } },
            log = MockLog(),
            app = { use: sinon.spy() },
            mocks = { express: { static: sinon.spy() } },
            path = '../../../src/configurators/static';
        doProxyquireTest(path, mocks, function(configurator) {
            configurator.init(app, config, '.', log);
            app.use.called.should.be.ok;
            mocks.express.static.called.should.be.ok;
            done();
        });
    });

    it('should not configure the static handler if it is not enabled', function(done) {
        var config = { static: { enabled: false } },
            log = MockLog(),
            app = { use: sinon.spy() },
            mocks = { express: { static: sinon.spy() } },
            path = '../../../src/configurators/static';
        doProxyquireTest(path, mocks, function(configurator) {
            configurator.init(app, config, '.', log);
            app.use.called.should.not.be.ok;
            mocks.express.static.called.should.not.be.ok;
            done();
        });
    });

    it('should set the configured path', function(done) {
        var config = { static: { enabled: true, options: { path: '.' } } },
            log = MockLog(),
            app = { use: sinon.spy() },
            mocks = { express: { static: sinon.spy() } },
            path = '../../../src/configurators/static';
        doProxyquireTest(path, mocks, function(configurator) {
            configurator.init(app, config, '.', log);
            app.use.calledWith(undefined, undefined).should.be.ok;
            mocks.express.static.calledWith().should.be.ok;
            done();
        });
    });

    it('should set the configured url', function(done) {
        var config = { static: { enabled: true, options: { path: '.', url: '/foo' } } },
            log = MockLog(),
            app = { use: sinon.spy() },
            mocks = { express: { static: sinon.spy() } },
            path = '../../../src/configurators/static';
        doProxyquireTest(path, mocks, function(configurator) {
            configurator.init(app, config, '.', log);
            app.use.calledWith(config.static.options.url, undefined).should.be.ok;
            done();
        });
    });
});
