'use strict';

var should = require('should'),
    sinon = require('sinon'),
    proxyquire = require('proxyquire');

describe('Run', function() {
    describe('execute', function() {
        beforeEach(function(done) {
            this.core = {
                server: {
                    start: sinon.spy(),
                },
            };

            this.command = proxyquire('../../../src/commands/run', { '../core': this.core });
            done();
        });

        it('should start the server', function(done) {
            this.command.execute({ _: [''] });
            this.core.server.start.called.should.be.ok;
            done();
        });

        it('should use the given config', function(done) {
            this.command.execute({ _: [''], config: 'foo' });
            this.core.server.start.calledWith('foo').should.be.ok;
            this.core.server.start.calledWith('ducks').should.not.be.ok;
            done();
        });
    });
});
