'use strict';

module.exports = {
    port: process.env.PORT || 3000,
    dependencies: [],
    modules: [],
    submodules: [
        'controllers',
        'events',
        'repositories',
        'routes',
        'services',
        'init'
    ],
    goa: {
        options: {
            defaultAction: 'handle'
        }
    },
    logging: {
        enabled: true,
        app: {
            logger: 'app'
        },
        http: {
            format: '{method} - {status} - {duration}ms - {path}',
            level: 'debug',
            logger: 'http'
        },
        loggers: {
            app: {
                console: {
                    level: 'debug'
                }
            },
            http: {
                console: {
                    level: 'debug'
                }
            }
        }
    },
    parsers: {
        json: {
            enabled: false,
            // see https://github.com/expressjs/body-parser/blob/master/README.md
            options: {}
        },
        raw: {
            enabled: false,
            // see https://github.com/expressjs/body-parser/blob/master/README.md
            options: {}
        },
        text: {
            enabled: false,
            // see https://github.com/expressjs/body-parser/blob/master/README.md
            options: {}
        },
        urlencoded: {
            enabled: false,
            // see https://github.com/expressjs/body-parser/blob/master/README.md
            options: {}
        }
    },
    static: {
        enabled: false,
        path: 'public',
        url: '/static'
    },
    views: {
        enabled: false,
        engine: null
    }
};
