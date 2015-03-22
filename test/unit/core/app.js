'use strict';

var should = require('should'),
    sinon = require('sinon'),
    utils = require('../../../src/utils'),
    doProxyquireTest = require('../helpers/proxyquire').doProxyquireTest,
    path = '../../../src/core/app';

describe('App', function() {
    describe('init', function() {
        beforeEach(function(done) {
            var self = this;

            this.app = {};

            this.log = {
                debug: sinon.spy(),
            };

            this.config = {
                ki: {
                    controllers: {},
                    project: {
                        files: []
                    }
                }
            };

            this.configurators = {
                init: sinon.spy(),

                get: sinon.spy(function() {
                    return self.configurators;
                }),

                logging: {
                    init: sinon.spy(),
                },
            };

            this.controllers = {
                get: sinon.spy(),
            };

            this.utils = {
                app: {
                    make: sinon.spy(function() {
                        return self.app;
                    }),
                },

                inject: utils.inject,

                logger: {
                    get: sinon.spy(function() {
                        return self.log;
                    }),
                },
            };

            this.mocks = {
                '../configurators': this.configurators,
                '../controllers': this.controllers,
                '../utils': this.utils,
            };

            done();
        });

        it('should start the app when start is called', function(done) {
            var self = this,
                caller = sinon.spy(),
                container = { registerInstance: sinon.spy() };
            doProxyquireTest(path, this.mocks, function(app) {
                app.init(self.config, '.', caller, container);
                self.utils.app.make.called.should.be.ok;
                done();
            });
        });

        it('should run the configurators', function(done) {
            var self = this,
                caller = sinon.spy(),
                container = { registerInstance: sinon.spy() };
            doProxyquireTest(path, this.mocks, function(app) {
                app.init(self.config, '.', caller, container);
                self.configurators.init.called.should.be.ok;
                done();
            });
        });
    });
});
