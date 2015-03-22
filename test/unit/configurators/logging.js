'use strict';

var should = require('should'),
    sinon = require('sinon'),
    doProxyquireTest = require('../helpers/proxyquire').doProxyquireTest,
    path = '../../../src/configurators/logging';

describe('Logging', function() {
    beforeEach(function(done) {
        this.app = {
            use: sinon.spy(),
        };

        this.utils = {
            logger: {
                init: sinon.spy(),
                get: sinon.spy(),
                middleware: sinon.spy(),
            },
        };

        this.mocks = {
            '../utils': this.utils
        };

        done();
    });

    it('should configure logging if it is enabled', function(done) {
        var self = this,
            config = { logging: { enabled: true, loggers: {} } };
        doProxyquireTest(path, this.mocks, function(configurator) {
            configurator.init(self.app, config);
            self.utils.logger.init.called.should.be.ok;
            done();
        });
    });

    it('should not configure logging if it is not enabled', function(done) {
        var self = this,
            config = { logging: { enabled: false } };
        doProxyquireTest(path, this.mocks, function(configurator) {
            configurator.init(self.app, config);
            self.utils.logger.init.called.should.not.be.ok;
            done();
        });
    });
});
