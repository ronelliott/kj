'use strict';

[
    [ 'mixins', 'mixins' ],
    [ 'base', 'BaseController' ],
    [ 'api-service', 'ApiServiceController' ],
    [ 'service', 'ServiceController' ],
    [ 'view', 'ViewController' ]
].forEach(function(items) {
        var path = './' + items[0],
            name = items[1];
        module.exports[name] = require(path);
    });