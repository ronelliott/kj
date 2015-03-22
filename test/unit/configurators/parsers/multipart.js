'use strict';

var should = require('should'),
    sinon = require('sinon'),
    doProxyquireTest = require('../../helpers/proxyquire').doProxyquireTest;

describe('Multipart', function() {
    it('should configure the multipart parser if it is enabled', function(done) {
        var config = { parsers: { multipart: { enabled: true } } },
            app = { use: sinon.spy() },
            mocks = { 'connect-multiparty': sinon.spy() },
            path = '../../../src/configurators/parsers/multipart';
        doProxyquireTest(path, mocks, function(configurator) {
            configurator.init(app, config);
            app.use.called.should.be.ok;
            mocks['connect-multiparty'].called.should.be.ok;
            done();
        });
    });

    it('should not configure the multipart parser if it is not enabled', function(done) {
        var config = { parsers: { multipart: { enabled: false } } },
            app = { use: sinon.spy() },
            mocks = { 'connect-multiparty': sinon.spy() },
            path = '../../../src/configurators/parsers/multipart';
        doProxyquireTest(path, mocks, function(configurator) {
            configurator.init(app, config);
            app.use.called.should.not.be.ok;
            mocks['connect-multiparty'].called.should.not.be.ok;
            done();
        });
    });
});
