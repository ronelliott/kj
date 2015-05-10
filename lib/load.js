'use strict';

var async = require('async'),
    extend = require('extend'),
    path = require('path'),
    reflekt = require('reflekt'),
    requireDirectory = require('require-directory');

function loadObject(obj, resolver, callback) {
    async.eachSeries(Object.keys(obj),
        function(key, next) {
            var value = obj[key],
                kind = typeof(value);

            if (kind === 'function') {
                resolver.add(key, value);
                next();
                return;
            }

            if (kind === 'object') {
                loadObject(value, resolver, next);
                return;
            }

            throw new Error('Unable to load: ' + obj.toString());
        }, callback);
}

function loadSubmodule(submod, resolver, callback) {
    if (typeof(submod) === 'function') {
        var resolutions = extend(true, {}, resolver.items, { callback: callback });
        reflekt.call(submod, resolutions);
        return;
    }

    if (typeof(submod) === 'object') {
        loadObject(submod, resolver, callback);
        return;
    }

    throw new Error('Unable to load: ' + submod.toString());
}

function load(config, modName, resolver, callback) {
    var modPath = modName,
        mod;

    if (modPath.indexOf('.') === 0) {
        modPath = path.resolve(process.cwd(), modPath);
        mod = requireDirectory({ require: require }, modPath);
    } else {
        mod = require(path.resolve('./node_modules/' + modPath));
    }

    async.eachSeries(config.submodules || [],
        function(submodName, next) {
            var submod = mod[submodName];

            if (!submod) {
                next();
                return;
            }

            loadSubmodule(submod, resolver, next);
        }, callback);
}

extend(module.exports, {
    load: load,
    object: loadObject,
    submodule: loadSubmodule
});
