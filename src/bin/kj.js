#!/usr/bin/env node
'use strict';

function main(argv) {
    var command = argv[2],
        args = argv.slice(3),
        commands = require('../commands');

    if (!command) {
        console.error('Usage: kj <command> <options> <args>');
        return;
    }

    commands.execute(command, args);
}

// detect if we are testing, the argv should contain `mocha`
if (process.argv.join().indexOf('mocha') === -1) {
    main(process.argv);
}

module.exports = {
    main: main,
};
