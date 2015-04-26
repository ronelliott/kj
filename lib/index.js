'use strict';

[
    'config',
    'app'
].forEach(function(sub) {
    module.exports[sub] = require('./' + sub);
});
