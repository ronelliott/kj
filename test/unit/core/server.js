'use strict';

var should = require('should'),
    sinon = require('sinon'),
    utils = require('../../../src/utils'),
    doProxyquireTest = require('../helpers/proxyquire').doProxyquireTest,
    path = '../../../src/core/server';

describe('Server', function() {
    describe('start', function() {
        it('should start the app when start is called', function(done) {
            var caller = sinon.spy(),
                config = sinon.spy(function() { return { server: { port: 7777 } }; }),
                log = {
                    debug: sinon.spy(),
                },
                app = {
                    listen: sinon.spy(),
                    set: sinon.spy(),
                },
                core = {
                    app: {
                        init: sinon.spy(function() {
                            return app;
                        }),
                    },
                },
                mocks = {
                    './config': config,
                    './': core,
                    '../utils': {
                        inject: utils.inject,

                        logger: {
                            get: sinon.spy(function() {
                                return log;
                            }),
                        },
                    }
                };

            doProxyquireTest(path, mocks, function(server) {
                server.start('test', '../', caller);
                core.app.init.called.should.be.ok;
                done();
            });
        });
    });
});
