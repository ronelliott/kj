'use strict';

describe('kj', function() {
    [
        'controllers',
        'repositories',
        'services',
        'app',
        'authorizer',
        'config',
        'load',
        'logging'
    ].forEach(function(name) {
            require('./' + name);
        });
});
