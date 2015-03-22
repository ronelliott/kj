'use strict';

var extend = require('extend'),
    sinon = require('sinon');

function mock(data) {
    return extend({}, {
        debug: sinon.spy(function() {}),
        error: sinon.spy(function() {}),
        info: sinon.spy(function() {}),
        warn: sinon.spy(function() {}),
    }, data);
}

module.exports = mock;
