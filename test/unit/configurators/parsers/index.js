'use strict';

describe('Parsers', function() {
    [
        'cookie',
        'json',
        'multipart',
        'raw',
        'text',
        'urlencoded',
    ].forEach(function(moduleName) {
        require('./' + moduleName);
    });
});
