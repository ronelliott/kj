'use strict';

[
    'interface',
    'bin',
    'commands',
    'config',
    'configurators',
    'controllers',
    'core',
    'repositories',
    'require',
    'services',
    'utils',
].forEach(function(moduleName) {
    require('./' + moduleName);
});
