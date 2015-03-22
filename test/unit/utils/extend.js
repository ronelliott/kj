'use strict';

var should = require('should'),
    doProxyquireTest = require('../helpers/proxyquire').doProxyquireTest,
    path = '../../../src/utils/extend';


describe('Extend', function() {
    it('should use the extend module', function(done) {
        var extend = { ducks: 'foo' },
            mocks = {
                'extend': extend,
            };

        doProxyquireTest(path, mocks, function(module) {
            module.should.eql(extend);
            done();
        });
    });
});
