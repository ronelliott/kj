'use strict';

var should = require('should'),
    sinon = require('sinon'),
    doProxyquireTest = require('../../helpers/proxyquire').doProxyquireTest;

describe('JSON', function() {
    it('should configure the json parser if it is enabled', function(done) {
        var config = { parsers: { json: { enabled: true } } },
            app = { use: sinon.spy() },
            mocks = { 'body-parser': { json: sinon.spy() } },
            path = '../../../src/configurators/parsers/json';
        doProxyquireTest(path, mocks, function(configurator) {
            configurator.init(app, config);
            app.use.called.should.be.ok;
            mocks['body-parser'].json.called.should.be.ok;
            done();
        });
    });

    it('should not configure the json parser if it is not enabled', function(done) {
        var config = { parsers: { json: { enabled: false } } },
            app = { use: sinon.spy() },
            mocks = { 'body-parser': { json: sinon.spy() } },
            path = '../../../src/configurators/parsers/json';
        doProxyquireTest(path, mocks, function(configurator) {
            configurator.init(app, config);
            app.use.called.should.not.be.ok;
            mocks['body-parser'].json.called.should.not.be.ok;
            done();
        });
    });
});
