'use strict';

var should = require('should'),
    sinon = require('sinon'),
    doProxyquireTest = require('../../helpers/proxyquire').doProxyquireTest;

describe('Text', function() {
    it('should configure the text parser if it is enabled', function(done) {
        var config = { parsers: { text: { enabled: true } } },
            app = { use: sinon.spy() },
            mocks = { 'body-parser': { text: sinon.spy() } },
            path = '../../../src/configurators/parsers/text';
        doProxyquireTest(path, mocks, function(configurator) {
            configurator.init(app, config);
            app.use.called.should.be.ok;
            mocks['body-parser'].text.called.should.be.ok;
            done();
        });
    });

    it('should not configure the text parser if it is not enabled', function(done) {
        var config = { parsers: { text: { enabled: false } } },
            app = { use: sinon.spy() },
            mocks = { 'body-parser': { text: sinon.spy() } },
            path = '../../../src/configurators/parsers/text';
        doProxyquireTest(path, mocks, function(configurator) {
            configurator.init(app, config);
            app.use.called.should.not.be.ok;
            mocks['body-parser'].text.called.should.not.be.ok;
            done();
        });
    });
});
