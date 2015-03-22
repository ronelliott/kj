'use strict';

var should = require('should'),
    sinon = require('sinon'),
    doProxyquireTest = require('../../helpers/proxyquire').doProxyquireTest;

describe('URLEncoded', function() {
    it('should configure the urlencoded parser if it is enabled', function(done) {
        var config = { parsers: { urlencoded: { enabled: true } } },
            app = { use: sinon.spy() },
            mocks = { 'body-parser': { urlencoded: sinon.spy() } },
            path = '../../../src/configurators/parsers/urlencoded';
        doProxyquireTest(path, mocks, function(configurator) {
            configurator.init(app, config);
            app.use.called.should.be.ok;
            mocks['body-parser'].urlencoded.called.should.be.ok;
            done();
        });
    });

    it('should not configure the urlencoded parser if it is not enabled', function(done) {
        var config = { parsers: { urlencoded: { enabled: false } } },
            app = { use: sinon.spy() },
            mocks = { 'body-parser': { urlencoded: sinon.spy() } },
            path = '../../../src/configurators/parsers/urlencoded';
        doProxyquireTest(path, mocks, function(configurator) {
            configurator.init(app, config);
            app.use.called.should.not.be.ok;
            mocks['body-parser'].urlencoded.called.should.not.be.ok;
            done();
        });
    });
});
