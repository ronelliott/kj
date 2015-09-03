'use strict';

var EventEmitter = require('events').EventEmitter,
    should = require('should'),
    sinon = require('sinon'),
    proxyquire = require('proxyquire');

describe('events', function() {
    beforeEach(function() {
        var self = this;
        this.serverMock = { listen: sinon.spy() };
        this.httpMock = {
            createServer: sinon.spy(function() {
                return self.serverMock;
            })
        };
        var App = proxyquire('../../lib/app', { http: this.httpMock });
        this.app = new App();
    });

    it('should emit a `app:init:begin` signal before running the initializers', function(done) {
        var initializerSpy = sinon.spy(),
            eventSpy = sinon.spy(function() {
                initializerSpy.called.should.equal(false);
            });

        this.app.on('app:init:begin', eventSpy);
        this.app.initialize([ initializerSpy ], function() {
            eventSpy.called.should.equal(true);
            done();
        });
    });

    it('should emit a `app:init:end` signal after running the initializers', function(done) {
        var initializerSpy = sinon.spy(),
            eventSpy = sinon.spy(function() {
                initializerSpy.called.should.equal(true);
            });

        this.app.on('app:init:end', eventSpy);
        this.app.initialize([ initializerSpy ], function() {
            eventSpy.called.should.equal(true);
            done();
        });
    });

    it('should emit a `app:start` signal after starting the server', function() {
        var self = this,
            eventSpy = sinon.spy(function() {
                self.serverMock.listen.called.should.equal(true);
            });

        this.app.on('app:start', eventSpy);
        this.app.start(3000);
        eventSpy.called.should.equal(true);
    });
});
