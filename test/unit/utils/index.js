'use strict';

describe('Utils', function() {
    [
        'app',
        'extend',
        'inject',
        'load',
        'logger',
        'path',
    ].forEach(function(moduleName) {
        require('./' + moduleName);
    });
});
