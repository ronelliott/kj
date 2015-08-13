'use strict';

var proxyquire = require('proxyquire'),
    should = require('should'),
    sinon = require('sinon');

describe('start', function() {
    function makeApp(mocks) {
        var App = proxyquire('../../lib/app', mocks || {});
        return new App();
    }

    it('should throw an error if no port number is given', function() {
        var app = makeApp();
        (function() {
            app.start();
        }).should.throw('No port number given!');
    });

    it('should throw an error if an invalid port number is given', function() {
        var app = makeApp();
        (function() {
            app.start('ducks');
        }).should.throw('Invalid port number!');
    });
    
    it('should create and start a http server', function() {
        var server = { listen: sinon.spy() },
            createServer = sinon.spy(function() { return server; }),
            app = makeApp({
                http: {
                    createServer: createServer
                }
            });

        app.start(3000);
        createServer.called.should.equal(true);
        server.listen.called.should.equal(true);
        server.listen.calledWith(3000).should.equal(true);
    });
});
