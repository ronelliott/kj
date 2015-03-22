'use strict';

describe('Core', function() {
    [
        'app',
        'server',
    ].forEach(function(moduleName) {
        require('./' + moduleName);
    });
});
