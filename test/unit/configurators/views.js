'use strict';

var should = require('should'),
    sinon = require('sinon'),
    path = require('path'),
    MockLog = require('../mocks/log'),
    doProxyquireTest = require('../helpers/proxyquire').doProxyquireTest;

describe('Views', function() {
    it('should configure views if it is enabled', function(done) {
        var config = { views: { enabled: true, options: { path: '.', engine: 'foo' } } },
            log = MockLog(),
            app = { set: sinon.spy() },
            mocks = {},
            directory = path.resolve(path.join('.', config.views.options.path)),
            module = '../../../src/configurators/views';
        doProxyquireTest(module, mocks, function(configurator) {
            configurator.init(app, config, '.', log);
            app.set.called.should.be.ok;
            app.set.calledWith('views', directory).should.be.ok;
            app.set.calledWith('view engine', config.views.options.engine).should.be.ok;
            done();
        });
    });

    it('should not configure views if it is not enabled', function(done) {
        var config = { views: { enabled: false } },
            log = MockLog(),
            app = { set: sinon.spy() },
            mocks = {},
            module = '../../../src/configurators/views';
        doProxyquireTest(module, mocks, function(configurator) {
            configurator.init(app, config, '.', log);
            app.set.called.should.not.be.ok;
            done();
        });
    });
});
