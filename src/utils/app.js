'use strict';

var goa = require('goa');

function make(config, factory) {
    return goa(factory, config.kj.goa);
}

module.exports = {
    make: make,
    json: goa.json,
    render: goa.view,
    text: goa.action,
};
