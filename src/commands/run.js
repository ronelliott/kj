'use strict';

function execute(args, container, caller) {
    var server = require('../core').server,
        path = require('../utils').path,
        working = path.absolute(args._[0] || '.');
    container.registerInstance(working, 'working');
    caller(server.start);
}

module.exports = {
    execute: execute,
};
