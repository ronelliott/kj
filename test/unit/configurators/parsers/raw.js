'use strict';

var should = require('should'),
    sinon = require('sinon'),
    doProxyquireTest = require('../../helpers/proxyquire').doProxyquireTest;

describe('Raw', function() {
    it('should configure the raw parser if it is enabled', function(done) {
        var config = { parsers: { raw: { enabled: true } } },
            app = { use: sinon.spy() },
            mocks = { 'body-parser': { raw: sinon.spy() } },
            path = '../../../src/configurators/parsers/raw';
        doProxyquireTest(path, mocks, function(configurator) {
            configurator.init(app, config);
            app.use.called.should.be.ok;
            mocks['body-parser'].raw.called.should.be.ok;
            done();
        });
    });

    it('should not configure the raw parser if it is not enabled', function(done) {
        var config = { parsers: { raw: { enabled: false } } },
            app = { use: sinon.spy() },
            mocks = { 'body-parser': { raw: sinon.spy() } },
            path = '../../../src/configurators/parsers/raw';
        doProxyquireTest(path, mocks, function(configurator) {
            configurator.init(app, config);
            app.use.called.should.not.be.ok;
            mocks['body-parser'].raw.called.should.not.be.ok;
            done();
        });
    });
});
