'use strict';

[
    [ 'cache', 'CacheMixin' ]
].forEach(function(items) {
        var path = './' + items[0],
            name = items[1];
        module.exports[name] = require(path);
    });