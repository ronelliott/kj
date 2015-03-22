'use strict';

describe('Controllers', function() {
    [
        'base',
        'view',
    ].forEach(function(moduleName) {
        require('./' + moduleName);
    });
});
