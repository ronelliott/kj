'use strict';

var should = require('should'),
    sinon = require('sinon'),
    doProxyquireTest = require('../helpers/proxyquire').doProxyquireTest,
    path = '../../../src/utils/app';


describe('App', function() {
    describe('make', function() {
        it('should use the goa module', function(done) {
            var factory = sinon.spy(),
                goa = sinon.spy(),
                config = {
                    ki: {
                        goa: {},
                    },
                },
                mocks = {
                    'goa': goa,
                };

            doProxyquireTest(path, mocks, function(app) {
                app.make(config, factory);
                goa.called.should.be.ok;
                done();
            });
        });

        it('should use the the correct config', function(done) {
            var factory = sinon.spy(),
                goa = sinon.spy(),
                config = {
                    ki: {
                        goa: {
                            ducks: 'foo',
                        },
                    },
                },
                mocks = {
                    'goa': goa,
                };

            doProxyquireTest(path, mocks, function(app) {
                app.make(config, factory);
                goa.called.should.be.ok;
                goa.calledWith(factory, config.ki.goa).should.be.ok;
                done();
            });
        });
    });
});
