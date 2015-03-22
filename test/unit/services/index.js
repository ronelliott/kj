'use strict';

describe('Services', function() {
    [
        'base',
    ].forEach(function(moduleName) {
        require('./' + moduleName);
    });
});
