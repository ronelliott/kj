'use strict';

describe('kj', function() {
    [
        'controllers',
        'repositories',
        'services'
    ].forEach(function(name) {
            require('./' + name);
        });
});
