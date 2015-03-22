'use strict';

describe('kj', function() {
    [
        'unit',
    ].forEach(function(moduleName) {
        require('./' + moduleName);
    });
});
