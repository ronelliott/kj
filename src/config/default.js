'use strict';

var colors = require('../utils').colors;

module.exports = {
    // relative to project directory
    configurators: [],

    csrf: {
        enabled: false,
        options: {},
    },

    helmet: {
        enabled: true,
        options: {},
    },

    // you probably shouldn't change any ki configuration unless you know what you're doing
    ki: {
        // relative to ki.configurators
        configurators: [
            'session', // important that it's before csrf
            'csrf',
            'helmet',
            'parsers',
            'static',
            'views',
        ],

        controllers: {},

        gen: {
            directory: 'skel', // relative to project directory
        },

        goa: {
            defaultAction: 'handle',
        },

        parsers: [
            'cookie',
            'json',
            'multipart',
            'urlencoded',
        ],

        project: {
            files: [
                'app',
                'routes',
            ],
        },
    },

    logging: {
        enabled: true,

        loggers: {
            app: {
                console: {
                    level: 'debug',
                    colorize: true,
                    timestamp: true,
                },
            },

            http: {
                console: {
                    level: 'debug',
                    colorize: true,
                    timestamp: true,
                },
            },
        },

        middleware: {
            enabled: true,

            level: 'debug',

            formatter: function formatter(elapsed, start, status, method, url, separator) {
                elapsed += 'ms';
                return [
                    colors[ method === 'GET' ? 'green' : method === 'DELETE' ? 'red' : 'yellow' ](method),
                    colors[ status < 300 ? 'green' : status < 400 ? 'yellow' : 'red' ](status),
                    colors.cyan(Array(6 - elapsed.length).join(' ') + elapsed),
                    url,
                ].join(separator);
            },
        },
    },

    parsers: {
        cookie: {
            enabled: true,
            options: {},
        },

        json: {
            enabled: true,
            options: {},
        },

        multipart: {
            enabled: true,
            options: {},
        },

        urlencoded: {
            enabled: true,
            options: {
                extended: true,
            },
        },
    },

    server: {
        port: process.env.PORT || 3000,
    },

    session: {
        enabled: false,
        options: {
            secret: 'some super secret secret',
            saveUninitialized: false,
            resave: false,
        }
    },

    static: {
        enabled: false,
        options: {
            path: 'static', // relative to project directory
            url:  '/static',
        }
    },

    views: {
        enabled: false,
        options: {
            engine: 'ejs',
            path: 'views', // relative to project directory
        },
    }
};
