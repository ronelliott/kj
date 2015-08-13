'use strict';

var App = require('../../lib/app'),
    should = require('should'),
    sinon = require('sinon');

describe('proxies', function() {
    function doTest(name, other) {
        var router = {},
            app = new App({ router: router }),
            spy = sinon.spy();

        router[other] = spy;
        app[name]('foo', 'bar');
        spy.called.should.equal(true);
    }

    require('methods')
        .concat([
            'all', 'route'
        ])
        .reduce(function(methods, method) {
                methods.push([ method, 'add' ]);
                return methods;
            }, [])
        .concat([
            [ 'unuse', 'unuse' ],
            [ 'use', 'use' ]
        ])
        .forEach(function(items) {
            var name = items[0],
                other = items[1];
            it('should proxy `' + name + '` to `' + other + '`', function() {
                doTest(name, other);
            });
    });
});
