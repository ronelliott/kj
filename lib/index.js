'use strict';

[
    'config',
    'app',
    'authorizer',
    'buses',
    'controllers',
    'repositories',
    'services'
].forEach(function(item) {
        var path = './' + item,
            name = item;
        module.exports[name] = require(path);
    });
