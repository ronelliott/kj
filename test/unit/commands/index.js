'use strict';

var should = require('should'),
    sinon = require('sinon'),
    extend = require('extend'),
    commands = require('../../../src/commands');


describe('Commands', function() {
    [
        'run',
    ].forEach(function(moduleName) {
        require('./' + moduleName);
    });

    describe('get', function() {
        beforeEach(function(done) {
            this.commands = extend({}, commands);
            this.commands.bar = {
                execute: 'bar.execute',
                options: {
                    something: 'bar.options',
                },
            };

            this.commands.foo = {
                bar: {
                    execute: 'foo.bar.execute',
                    options: {
                        something: 'foo.bar.options'
                    },
                }
            };
            done();
        });

        it('should not return anything for an un-nested command that was not found', function(done) {
            should(this.commands.get('flabbergasted')).not.be.ok;
            done();
        });

        it('should return the correct un-nested command correctly', function(done) {
            var command = this.commands.get('bar');
            command.should.be.ok;
            command.options.should.eql({ something: 'bar.options' });
            done();
        });

        it('should not return anything for an nested command that was not found', function(done) {
            should(this.commands.get('flabbergasted', 'yup')).not.be.ok;
            done();
        });

        it('should return the correct nested command correctly', function(done) {
            var command = this.commands.get('foo', 'bar');
            command.should.be.ok;
            command.options.should.eql({ something: 'foo.bar.options' });
            done();
        });

        it('should return handle parent and sub options correctly', function(done) {
            this.commands.foo = {
                options: {
                    other: 'yup'
                },

                bar: {
                    options: {
                        something: 'foo.bar.options'
                    }
                }
            };

            var command = this.commands.get('foo', 'bar');
            command.options.should.eql({ other: 'yup', something: 'foo.bar.options' });
            done();
        });
    });

    describe('execute', function() {
        beforeEach(function(done) {
            this.commands = extend({}, commands, {
                getCommand: sinon.spy(commands.getCommand),
                getOptions: sinon.spy(commands.getOptions),
            });

            this.commands.bar = {
                execute: sinon.spy(),
                options: {
                    something: 'bar.options'
                }
            };

            this.commands.foo = {
                bar: {
                    execute: sinon.spy(),
                    options: {
                        something: 'foo.bar.options'
                    }
                }
            };

            done();
        });

        it('should functions correctly with nested commands', function(done) {
            this.commands.execute('foo:bar');
            this.commands.foo.bar.execute.called.should.be.ok;
            done();
        });

        it('should functions correctly with un-nested commands', function(done) {
            this.commands.execute('bar');
            this.commands.bar.execute.called.should.be.ok;
            done();
        });
    });
});
