'use strict';

var should = require('should'),
    doProxyquireTest = require('../helpers/proxyquire').doProxyquireTest,
    path = '../../../src/utils/inject';


describe('Inject', function() {
    it('should use the reflekt module', function(done) {
        var reflekt = { ducks: 'foo' },
            mocks = {
                'reflekt': reflekt,
            };

        doProxyquireTest(path, mocks, function(module) {
            module.should.eql(reflekt);
            done();
        });
    });
});
