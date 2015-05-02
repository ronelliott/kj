'use strict';

[
    'config',
    'app',
    'controllers',
    'repositories',
    'services'
].forEach(function(item) {
        var path = './' + item,
            name = item;
        module.exports[name] = require(path);
    });
