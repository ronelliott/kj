'use strict';

var should = require('should'),
    doProxyquireTest = require('../helpers/proxyquire').doProxyquireTest,
    path = '../../../src/utils/path';


describe('Path', function() {
    describe('absolute', function() {
        it('should use the path.resolve method', function(done) {
            var mod = { resolve: 'foo' },
                mocks = {
                    'path': mod,
                };

            doProxyquireTest(path, mocks, function(module) {
                module.absolute.should.eql(mod.resolve);
                done();
            });
        });
    });

    describe('join', function() {
        it('should use the path.join method', function(done) {
            var mod = { join: 'foo' },
                mocks = {
                    'path': mod,
                };

            doProxyquireTest(path, mocks, function(module) {
                module.join.should.eql(mod.join);
                done();
            });
        });
    });
});
