'use strict';

var should = require('should'),
    sinon = require('sinon'),
    doProxyquireTest = require('../helpers/proxyquire').doProxyquireTest,
    path = '../../../src/bin/ki';

describe('Bin', function() {
    [
    ].forEach(function(moduleName) {
        require('./' + moduleName);
    });

    it('should call execute with the name of the command if it one is given', function(done) {
        var commands = {
                execute: sinon.spy(),
            },
            mocks = {
                '../commands': commands,
            };

        doProxyquireTest(path, mocks, function(bin) {
            bin.main([ 'node', '/usr/local/bin/ki', 'run', 'example/' ]);
            commands.execute.called.should.be.ok;
            commands.execute.calledWith('run', [ 'example/' ]).should.be.ok;
            done();
        });
    });

    it('should not call execute with the name of the command if it one is not given', function(done) {
        var commands = {
                execute: sinon.spy(),
            },
            mocks = {
                '../commands': commands,
            };

        doProxyquireTest(path, mocks, function(bin) {
            bin.main([]);
            commands.execute.called.should.not.be.ok;
            done();
        });
    });
});
