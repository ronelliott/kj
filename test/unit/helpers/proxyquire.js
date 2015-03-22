'use strict';

var proxyquire = require('proxyquire').noCallThru();

function doProxyquireTest(path, mocks, callback) {
    var module = proxyquire(path, mocks);
    callback(module);
}

module.exports.doProxyquireTest = doProxyquireTest;
