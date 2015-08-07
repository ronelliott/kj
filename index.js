'use strict';

[
    'app',
    'commands',
    'utils'
].forEach(function(name) {
        module.exports[name] = require('./' + name);
    });

module.exports.express = require('express');
