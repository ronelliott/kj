'use strict';

const App = require('./app'),
      Router = require('./router');

function app(options) {
    return new App(options);
}

function router(options) {
    return new Router(options);
}

module.exports = {
    App: App,
    Request: require('./request'),
    Response: require('./response'),
    Router: Router,
    app: app,
    async: require('async'),
    error: require('./error'),
    extend: require('extend'),
    factory: require('./factory'),
    is: require('is'),
    methods: require('methods'),
    reflekt: require('reflekt'),
    router: router
};
