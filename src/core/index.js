'use strict';

[
    'app',
    'server',
].forEach(function(moduleName) {
    module.exports[moduleName] = require('./' + moduleName);
});
