'use strict';

var should = require('should'),
    sinon = require('sinon'),
    ViewController = require('../../../src/controllers/view').ViewController;

describe('ViewController', function() {
    describe('render', function() {
        it('should call the render send method with the configured view and context', function(done) {
            var controller = new ViewController(),
                spy = sinon.spy();

            controller.render({ view: 'foo' }, spy);
            spy.called.should.be.ok;
            spy.calledWith('foo', {}).should.be.ok;
            done();
        });

        it('should call the render send method with the `index` view if no view is configured', function(done) {
            var controller = new ViewController(),
                spy = sinon.spy();

            controller.render({}, spy);
            spy.called.should.be.ok;
            spy.calledWith('index', {}).should.be.ok;
            done();
        });
    });
});
