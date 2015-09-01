'use strict';

var should = require('should'),
    sinon = require('sinon'),
    factory = require('../../lib/factory'),
    reflekt = require('reflekt');

describe('resolving', function() {
    beforeEach(function() {
        var self = this;

        this.h1 = sinon.spy();
        this.factory = sinon.spy(function() {
            return self.h1;
        });

        this.caller = reflekt.caller({ foo: this.factory });
    });

    it('should resolve the handler if it is a string', function() {
        var opts = 'foo',
            result = factory(this.caller, opts);
        result.should.equal(this.h1);
    });

    it('should use the property `handler` if the given options is an object', function() {
        var opts = { handler: this.factory },
            result = factory(this.caller, opts);
        result.should.equal(this.h1);
    });

    it('should resolve the handler if it is an object and the `handler` property is defined as a string', function() {
        var opts = { handler: 'foo' },
            result = factory(this.caller, opts);
        result.should.equal(this.h1);
    });
});
