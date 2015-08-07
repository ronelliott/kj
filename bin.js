#!/usr/bin/env node
'use strict';

var async = require('async'),
    defaults = require('./config'),
    extend = require('extend'),
    kmd = require('kmd-cli'),
    kj = require('./'),
    pth = require('path');

function createContext(next) {
    next(null, {});
}

function parseArgs(ctx, next) {
    ctx.argv = kmd.parse();
    next(null, ctx);
}

function loadConfig(ctx, next) {
    ctx.config = extend(true, {}, defaults);

    async.eachSeries([
        ctx.argv.config,
        'config.js',
        'config.json'
    ], function(path, next) {
        if (!path) {
            next();
            return;
        }

        try {
            var config = require(pth.resolve(path));
            extend(true, ctx.config, config);
            next({ loaded: true });
        } catch(e) {
            if (e.code === 'MODULE_NOT_FOUND') {
                e = null;
            }

            next(e);
        }
    }, function(err) {
        if (err && err.loaded) {
            err = null;
        }

        next(err, ctx);
    });
}

function loadCommands(ctx, next) {
    kmd.load(function(err, commands) {
        ctx.commands = extend(true, kj.commands, commands);
        next(err, ctx);
    });
}

function parseCommand(ctx, next) {
    ctx.command = ctx.argv._[0] || 'help';
    next(null, ctx);
}

function runCommand(ctx, next) {
    kmd.run(ctx.command, function(err, app) {
        ctx.app = app;
        next(err, ctx);
    }, ctx.commands, ctx);
}

async.waterfall([
    createContext,
    parseArgs,
    loadConfig,
    loadCommands,
    parseCommand,
    runCommand
]);
