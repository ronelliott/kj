'use strict';

var should = require('should'),
    ki = require('../../src');

describe('Interface', function() {
    function doModuleInterfaceTest(name, inverse, properties) {
        if (typeof(properties) === 'undefined') {
            properties = inverse;
            inverse = true;
        }

        var module = eval(name);

        describe(name, function() {
            properties.forEach(function(property) {
                it('should have a property named `' + property + '`', function() {
                    module.should.have.property(property);
                });
            });

            if (inverse) {
                it('should have no other properties', function(done) {
                    var has = Object.keys(module),
                        // copy the properties object
                        desired = JSON.parse(JSON.stringify(properties));

                    // sort both so ordering doesn't matter
                    has.sort();
                    desired.sort();

                    desired.should.eql(has);
                    done();
                });
            }
        });
    }

    doModuleInterfaceTest('ki', [
        'core',
        'commands',
        'config',
        'configurators',
        'controllers',
        'repositories',
        'services',
        'utils',
    ]);


    doModuleInterfaceTest('ki.commands', [
        'get',
        'execute',
        'gen',
        'run',
    ]);


    doModuleInterfaceTest('ki.config', [
    ]);


    doModuleInterfaceTest('ki.configurators', [
        'csrf',
        'helmet',
        'logging',
        'parsers',
        'session',
        'static',
        'views',
        'get',
        'init',
    ]);


    doModuleInterfaceTest('ki.configurators.csrf', [
        'init',
    ]);


    doModuleInterfaceTest('ki.configurators.helmet', [
        'init',
    ]);


    doModuleInterfaceTest('ki.configurators.logging', [
        'init',
    ]);


    doModuleInterfaceTest('ki.configurators.parsers', [
        'get',
        'cookie',
        'json',
        'multipart',
        'raw',
        'text',
        'urlencoded',
        'init',
    ]);


    doModuleInterfaceTest('ki.configurators.session', [
        'init',
    ]);


    doModuleInterfaceTest('ki.configurators.static', [
        'init',
    ]);


    doModuleInterfaceTest('ki.configurators.views', [
        'init',
    ]);


    doModuleInterfaceTest('ki.configurators.parsers.cookie', [
        'init',
    ]);


    doModuleInterfaceTest('ki.configurators.parsers.json', [
        'init',
    ]);


    doModuleInterfaceTest('ki.configurators.parsers.multipart', [
        'init',
    ]);


    doModuleInterfaceTest('ki.configurators.parsers.raw', [
        'init',
    ]);


    doModuleInterfaceTest('ki.configurators.parsers.text', [
        'init',
    ]);


    doModuleInterfaceTest('ki.configurators.parsers.urlencoded', [
        'init',
    ]);


    doModuleInterfaceTest('ki.controllers', [
        'BaseController',
        'ServiceController',
        'JSONServiceController',
        'ViewController',
        'get',
    ]);


    doModuleInterfaceTest('ki.controllers.BaseController.prototype', [
        'handle',
        'getHandler',
        'getResolutions',
    ]);


    doModuleInterfaceTest('ki.controllers.ViewController.prototype', [
        'context',
        'handle',
        'render',
        'getHandler',
        'getResolutions',
    ]);


    doModuleInterfaceTest('ki.core', [
        'app',
        'server',
    ]);


    doModuleInterfaceTest('ki.core.app', [
        'get',
        'del',
        'post',
        'put',
        'factory',
        'init',
    ]);


    doModuleInterfaceTest('ki.core.server', [
        'start',
    ]);


    doModuleInterfaceTest('ki.repositories', [
        'BaseRepository',
        'CacheRepository',
        'RedisRepository',
    ]);


    doModuleInterfaceTest('ki.repositories.BaseRepository.prototype', [
        'create',
        'delete',
        'find',
        'get',
        'transact',
        'update',
    ]);


    doModuleInterfaceTest('ki.repositories.CacheRepository.prototype', [
        'create',
        'delete',
        'find',
        'get',
        'identifier',
        'transact',
        'update',
    ]);


    doModuleInterfaceTest('ki.repositories.RedisRepository.prototype', [
        'create',
        'delete',
        'find',
        'get',
        'identifier',
        'transact',
        'update',
    ]);


    doModuleInterfaceTest('ki.services', [
        'BaseService',
    ]);


    doModuleInterfaceTest('ki.services.BaseService.prototype', [
    ]);


    doModuleInterfaceTest('ki.utils', [
        'app',
        'colors',
        'extend',
        'inherits',
        'inject',
        'load',
        'logger',
        'path',
        'redis',
        'validation',
    ]);


    doModuleInterfaceTest('ki.utils.app', [
        'json',
        'make',
        'render',
    ]);


    doModuleInterfaceTest('ki.utils.colors', false, [
    ]);


    doModuleInterfaceTest('ki.utils.extend', [
    ]);


    doModuleInterfaceTest('ki.utils.inherits', [
    ]);


    doModuleInterfaceTest('ki.utils.inject', false, [
        'call',
        'caller',
    ]);


    doModuleInterfaceTest('ki.utils.load', [
    ]);


    doModuleInterfaceTest('ki.utils.logger', [
        'get',
        'init',
        'middleware',
    ]);


    doModuleInterfaceTest('ki.utils.path', [
        'absolute',
        'children',
        'exists',
        'join',
        'modularize',
    ]);


    doModuleInterfaceTest('ki.utils.redis', false, [
        'createClient',
    ]);
});
