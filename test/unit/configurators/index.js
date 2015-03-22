'use strict';

describe('Configurators', function() {
    [
        'csrf',
        'helmet',
        'logging',
        'parsers',
        'session',
        'static',
        'views',
    ].forEach(function(moduleName) {
        require('./' + moduleName);
    });
});
