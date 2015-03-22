'use strict';

function init(app, config, log) {
    if (config.csrf.enabled) {
        log.info('CSRF enabled.');
        var csurf = require('csurf');
        app.use(csurf(config.csrf.options));
        // // set the XSRF-TOKEN cookie to the value of the request's CSRF token,
        // // this is the value used by angular.js to set the X-XSRF-TOKEN header, see:
        // // https://docs.angularjs.org/api/ng/service/$http#cross-site-request-forgery-xsrf-protection
        // app.use(function(req, res, next) {
        //     res.cookie(config.csrf.cookie.key, req.csrfToken());
        //     next();
        // });
    } else {
        log.warn('CSRF disabled!');
    }
}

module.exports = {
    init: init,
};
