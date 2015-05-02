'use strict';

describe('repositories', function() {
    [
        'base',
        'cache'
    ].forEach(function(name) {
            require('./' + name);
        });
});
