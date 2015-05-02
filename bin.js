#!/usr/bin/env node

'use strict';

var async = require('async'),
    extend = require('extend'),
    kj = require('./lib'),
    argv = require('minimist')(process.argv.slice(2)),
    config;

async.eachSeries([
    argv.config,
    argv._[0],
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

        console.log('using config:', name);
        config = loaded;
        next();
    });
}, function(err) {
    if (err) {
        console.error(err);
        return;
    }

    console.log('starting server');
    kj.app.start(argv, config || {}, function(err, app) {
        if (err) {
            console.error(err);
            return;
        }

        console.log('server started on :%s', app.get('port'));
    });
});
