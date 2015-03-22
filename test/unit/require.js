'use strict';

var doExternalRequireTest = require('./helpers/require').doExternalRequireTest;


describe('External Requires', function() {
    [
        'src/bin/ki.js',
        'src/commands/gen.js',
        ['src/commands/index.js', 'minimist', 'sahara'],
        'src/commands/run.js',
        'src/config/default.js',
        'src/config/index.js',
        'src/config/test.js',
        ['src/configurators/csrf.js', 'csurf'],
        ['src/configurators/helmet.js', 'helmet'],
        'src/configurators/index.js',
        'src/configurators/logging.js',
        'src/configurators/parsers/cookie.js',
        'src/configurators/parsers/index.js',
        'src/configurators/parsers/json.js',
        'src/configurators/parsers/multipart.js',
        'src/configurators/parsers/raw.js',
        'src/configurators/parsers/text.js',
        'src/configurators/parsers/urlencoded.js',
        'src/configurators/session.js',
        ['src/configurators/static.js', 'express'],
        'src/configurators/views.js',
        'src/controllers/base.js',
        'src/controllers/index.js',
        'src/controllers/view.js',
        'src/core/app.js',
        'src/core/index.js',
        'src/core/server.js',
        'src/index.js',
        'src/repositories/base.js',
        'src/repositories/index.js',
        'src/services/base.js',
        'src/services/index.js',
    ].forEach(function(path) {
        doExternalRequireTest(path);
    });
});
