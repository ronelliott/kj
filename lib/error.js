'use strict';

var is = require('is');

module.exports = function(err, $res) {
    if (!err) return;

    if (err.notAuthorized) {
        $res.status('unauthorized');
        return;
    }

    if (err.notFound) {
        $res.status('not found');
        return;
    }

    if ([ 200, null, undefined ].indexOf($res.status()) !== -1) {
        $res.status('internal server error');
    }

    if (err.status || err.statusCode) {
        $res.status(err.status || err.statusCode);
    }

    if (is.object(err)) {
        err = JSON.stringify(err);
    }

    $res.write(err.stack ? err.stack : err.toString());
};
