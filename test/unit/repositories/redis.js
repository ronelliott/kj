'use strict';

var should = require('should'),
    sinon = require('sinon'),
    utils = require('../../../src/utils'),
    doProxyquireTest = require('../helpers/proxyquire').doProxyquireTest;

describe('RedisRepository', function() {
    describe('transact', function() {
        it('should create a redis client', function(done) {
            var mockUtils = utils.extend({}, utils, {
                    redis: {
                        createClient: sinon.spy(function() { return 'foo'; }),
                    },
                }),
                mocks = { '../utils' : mockUtils },
                path = '../../../src/repositories/redis';
            doProxyquireTest(path, mocks, function(module) {
                var repository = new module.RedisRepository(),
                    spy = sinon.spy();

                repository.transact(spy);
                mockUtils.redis.createClient.called.should.be.ok;
                spy.calledWith('foo').should.be.ok;
                done();
            });
        });
    });
});
