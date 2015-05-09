#!/usr/bin/env node

'use strict';

var async = require('async'),
    extend = require('extend'),
    kj = require('./lib'),
    argv = require('minimist')(process.argv.slice(2));

kj.config.get(function(err, config, name, configPath) {
    if (err) {
        console.error(err);
        return;
    }

    console.log('using config:', configPath);
    kj.app.start(argv, config, function(err, app, log) {
        log = log || { error: console.error, info: console.log };

        if (err) {
            log.error(err);
            return;
        }

        log.info('server started on :%s', app.get('port'));
    });
});
