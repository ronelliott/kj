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
        'services'
    ],
    goa: {
        options: {
            defaultAction: 'handle'
        }
    },
    helmet: {
        enabled: false,
        options: {}
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
    }
};
