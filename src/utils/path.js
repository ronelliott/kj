'use strict';

var fs = require('fs'),
    path = require('path');

function absolute(location) {
    return path.resolve.apply(this, arguments);
}

function children(base) {
    return fs.readdirSync(base);
}

function exists(location) {
    return fs.exists.apply(this, arguments);
}

function join(location) {
    return path.join.apply(this, arguments);
}

function modularize(base) {
    base = absolute(join(process.cwd(), base || '.'));
    var module = {};

    if (exists(base)) {
        var names = children(base)
            .filter(function (child) {
                return /\.js$/.test(child) && child !== 'index.js';
            })
            .map(function (name) {
                return name.replace(/\.js$/, '');
            });

        names.forEach(function (name) {
            module[name] = require(join(base, name));
        });
    }

    return module;
}

module.exports = {
    absolute: absolute,
    children: children,
    exists: exists,
    join: join,
    modularize: modularize,
};

