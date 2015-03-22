'use strict';

var minimist = require('minimist'),
    sahara = require('sahara'),
    utils = require('../utils'),
    extend = utils.extend,
    inject = utils.inject,
    modularize = utils.path.modularize,
    commands = {};

[
    'gen',
    'run',
].forEach(function(moduleName) {
    commands[moduleName] = require('./' + moduleName);
});

commands = extend({}, commands, modularize('./commands'));

function get(name, sub) {
    var parent,
        child,
        command;

    if (name) {
        parent = commands[name];
    }

    if (parent && sub) {
        child = parent[sub];
    }

    if (child && parent) {
        command = {
            execute: child.execute,
            options: extend({}, parent.options, child.options),
        };
    } else if (parent) {
        command = {
            execute: parent.execute,
            options: extend({}, parent.options),
        };
    }

    return command;
}

function execute(name, argv) {
    name = name || 'default';
    argv = argv || [];

    var split = name.split(':'),
        parent = split[0] || 'stupid',
        sub = split[1],
        command = get(parent, sub);

    if (!command) {
        console.error('Command not found: %s', name);
        return;
    }

    var args = minimist(argv, command.options);
    args.config = args.config || 'config';

    if (args.help) {
        // TODO: make this print pretty args
        console.log(command.options);
        return;
    }

    if (!command.execute) {
        console.error(
            'Method `execute` not found on command `%s`', name,
            'Please ensure an `execute` method is exported!');
        return;
    }

    var config = require('../config')(args.config),
        container = new sahara.Container(),
        caller = inject.caller(function(name) {
            return container.resolveSync(name);
        });

    container.registerInstance(caller, 'caller');
    container.registerInstance(container, 'container');
    container.registerInstance(args, 'args');
    container.registerInstance(config, 'config');
    caller(command.execute);
}

module.exports = extend({
    get:      get,
    execute:  execute,
}, commands);
