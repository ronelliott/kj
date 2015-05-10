'use strict';

var EventEmitter = require('events').EventEmitter,
    extend = require('extend'),
    inherits = require('util').inherits;

function BaseBus() {
    EventEmitter.call(this);
}

inherits(BaseBus, EventEmitter);

extend(BaseBus.prototype, {});

module.exports = BaseBus;
