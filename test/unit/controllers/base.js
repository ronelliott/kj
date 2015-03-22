'use strict';

var should = require('should'),
    sinon = require('sinon'),
    BaseController = require('../../../src/controllers/base').BaseController;

describe('BaseController', function() {
    describe('handle', function() {
        it('should provide a json send method', function(done) {
            var called = false,
                controller = new BaseController();
            controller.foo = function(json) {
                called = true;
                json.should.be.ok;
                json.should.be.a.Function;
            };

            controller.handle({ method: 'foo' });
            called.should.be.ok;
            done();
        });

        it('should provide a render view send method', function(done) {
            var called = false,
                controller = new BaseController();
            controller.foo = function(render) {
                called = true;
                render.should.be.ok;
                render.should.be.a.Function;
            };

            controller.handle({ method: 'foo' });
            called.should.be.ok;
            done();
        });

        it('should call the correct method on the child controller', function(done) {
            var controller = new BaseController(),
                spy = sinon.spy();
            controller.foo = spy;

            controller.handle({ method: 'foo' });
            spy.called.should.be.ok;
            done();
        });
    });
});
