'use strict';

var should = require('should'),
    sinon = require('sinon'),
    EventEmitter = require('events').EventEmitter,
    doProxyquireTest = require('../helpers/proxyquire').doProxyquireTest,
    path = '../../../src/utils/logger';


describe('Logger', function() {
    describe('get', function() {
        it('should use the winston.loggers.get method with the given name', function(done) {
            var winston = {
                    loggers: {
                        get: sinon.spy(),
                    },
                },
                mocks = {
                    'winston': winston,
                };

            doProxyquireTest(path, mocks, function(logger) {
                logger.get('foo');
                winston.loggers.get.called.should.be.ok;
                winston.loggers.get.calledWith('foo').should.be.ok;
                done();
            });
        });
    });

    describe('init', function() {
        it('should use the winston.loggers.add method on each given logger with the given config', function(done) {
            var winston = {
                    loggers: {
                        add: sinon.spy(),
                    },
                },
                mocks = {
                    'winston': winston,
                };

            doProxyquireTest(path, mocks, function(logger) {
                var loggers = {
                    foo: 'foo',
                    bar: 'bar',
                };

                logger.init(loggers);
                winston.loggers.add.called.should.be.ok;
                winston.loggers.add.calledWith('foo', loggers.foo).should.be.ok;
                winston.loggers.add.calledWith('bar', loggers.bar).should.be.ok;
                done();
            });
        });
    });

    describe('middleware', function() {
        it('should call the configured formatter', function(done) {
            var config = {
                    level: 'debug',
                    formatter: sinon.spy(),
                },
                log = {
                    debug: sinon.spy(),
                },
                req = {},
                res = new EventEmitter(),
                spy = sinon.spy(),
                mocks = {};

            doProxyquireTest(path, mocks, function(logger) {
                var middleware = logger.middleware(config, log);
                middleware(req, res, spy);
                res.emit('finish');
                config.formatter.called.should.be.ok;
                spy.called.should.be.ok;
                done();
            });
        });

        it('should use the configured level', function(done) {
            var config = {
                    level: 'flubber',
                    formatter: sinon.spy(),
                },
                log = {
                    flubber: sinon.spy(),
                },
                req = {},
                res = new EventEmitter(),
                spy = sinon.spy(),
                mocks = {};

            doProxyquireTest(path, mocks, function(logger) {
                var middleware = logger.middleware(config, log);
                middleware(req, res, spy);
                res.emit('finish');
                log.flubber.called.should.be.ok;
                done();
            });
        });
    });
});
