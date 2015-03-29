'use strict';

var utils = require('../utils'),
    makeApp = utils.app.make,
    inject = utils.inject,
    path = utils.path;

function get(app) {
    return function get() {
        app.get.apply(app, arguments);
    };
}

function del(app) {
    return function del() {
        app.delete.apply(app, arguments);
    };
}

function post(app) {
    return function post() {
        app.post.apply(app, arguments);
    };
}

function put(app) {
    return function put() {
        app.put.apply(app, arguments);
    };
}

function init(config, working, caller, container) {
    var log;

    function factory(controllers) {
        return function factory(name, context, callback) {
            name = name || 'BaseController';
            var Controller = controllers[name];

            if (!Controller) {
                var message = 'Controller named `' + name + '` not found! ' +
                              'Did you define a `controller` property on your route?';
                throw new Error(message);
            }

            context.container = container;
            context.config = config;
            context.log = log;
            context.working = working;
            callback(null, new Controller(context));
        };
    }

    var controllers = require('../controllers').get(working),
        app = makeApp(config, config.kj.controllers.factory || factory(controllers)),
        configurators = require('../configurators').get(working);

    container.registerInstance(app, 'app');
    container.registerInstance(controllers, 'controllers');
    container.registerInstance(configurators, 'configurators');

    // run the logging configurator
    var logger = caller(configurators.logging.init);

    log = logger.get('app');
    container.registerInstance(log, 'log');
    log.debug('Using working path:', working);

    // load the configurators
    inject.call(configurators.init, {
        app: app,
        config: config,
        log: log,
        working: working,
    });

    container.registerInstance(get(app), 'get');
    container.registerInstance(del(app), 'del');
    container.registerInstance(post(app), 'post');
    container.registerInstance(put(app), 'put');

    // load the project files
    config.kj.project.files.forEach(function(sub) {
        try {
            var modulePath = path.join(working, sub),
                module = require(modulePath);

            if (typeof module.init !== 'undefined') {
                log.debug('Running project file:', sub);
                caller(module.init);
            } else {
                log.error('Please export a function named `init` for', modulePath + '.js');
            }
        } catch(e) {
            if (e.code !== 'MODULE_NOT_FOUND') {
                throw e;
            }
        }
    });

    return app;
}

module.exports = {
    get: get,
    del: del,
    post: post,
    put: put,
    init: init,
};
