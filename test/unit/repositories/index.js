'use strict';

describe('Repositories', function() {
    [
        'base',
        'cache',
        'redis',
    ].forEach(function(moduleName) {
        require('./' + moduleName);
    });
});
