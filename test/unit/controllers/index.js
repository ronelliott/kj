'use strict';

describe('controllers', function() {
    [
        'base',
        'api-service',
        'service',
        'view'
    ].forEach(function(name) {
            require('./' + name);
        });
});
