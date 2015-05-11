'use strict';

var app = require('./app'),
    config = require('./config'),
    extend = require('extend');

function run(args) {
    var argv = require('minimist')(args || process.argv.slice(2));

    config.get(function (err, config, name, configPath) {
        if (err) {
            console.error(err);
            return;
        }

        console.log('using config:', configPath);
        app.start(argv, config, function (err, app, log) {
            log = log || {error: console.error, info: console.log};

            if (err) {
                log.error(err);
                return;
            }

            log.info('server started on :%s', app.get('port'));
        });
    });
}

module.exports = run;
