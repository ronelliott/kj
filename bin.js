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
    console.log('starting server');
    kj.app.start(argv, config, function(err, app) {
        if (err) {
            console.error(err);
            return;
        }

        console.log('server started on :%s', app.get('port'));
    });
});
