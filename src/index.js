'use strict';

[
    'core',
    'commands',
    'config',
    'configurators',
    'controllers',
    'core',
    'repositories',
    'services',
    'utils',
].forEach(function(moduleName) {
    module.exports[moduleName] = require('./' + moduleName);
});
