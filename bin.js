#!/usr/bin/env node

'use strict';

var async = require('async'),
    kj = require('./lib'),
    options = require('minimist')(process.argv.slice(2)),
    config;

async.eachSeries([
    options.config,
    options._[0],
    './config.js',
    './config.json',
    './config.yml',
    './config.yaml'
], function(name, next) {
    if (config || !name) {
        next();
        return;
    }

    kj.config.get(name, function(err, loaded) {
        if (err) {
            if (!err.exists) {
                next();
                return;
            }

            next(err);
        }

        config = loaded;
        next();
    });
}, function(err) {
    if (err) {
        console.error(err);
        return;
    }

    kj.app.start(config, options, function(err, app) {
        if (err) {
            console.error(err);
            return;
        }
    });
});
