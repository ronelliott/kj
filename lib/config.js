'use strict';

var extend = require('extend'),
    extname = require('path').extname,
    fs = require('fs'),
    path = require('path'),
    yaml = require('yaml');

function jsLoader(child, callback) {
    if (extname(child) === '.js') {
        child = child.replace('.js', '');
    }

    var config = require(child);

    if (typeof(config) === 'function') {
        config(callback);
        return;
    }

    callback && callback(null, config);
}

function yamlLoader(child, callback) {
    fs.readFile(child, function(err, raw) {
        if (err) {
            callback && callback(err);
            return;
        }

        callback && callback(null, yaml.eval(raw.toString()));
    });
}

function defaultt() {
    return extend(true, {}, require(path.join('..', 'config')));
}

function get(path, defaults, callback) {
    if (typeof(callback) === 'undefined' && typeof(defaults) === 'function') {
        callback = defaults;
        defaults = defaultt();
    }

    load(path, function(err, config) {
        if (err) {
            callback && callback(err);
            return;
        }

        config = extend(true, {}, defaults, config);
        callback && callback(null, config);
    });
}

function load(configPath, callback) {
    configPath = path.resolve(path.join(process.cwd(), configPath));

    if (!fs.existsSync(configPath)) {
        callback && callback({ exists: false, message: 'The given path does not exist.' });
        return;
    }

    var extension = extname(configPath).replace('.', ''),
        loader = {
            js: jsLoader,
            json: jsLoader,
            yml: yamlLoader,
            yaml: yamlLoader
        }[extension];

    if (!loader) {
        callback && callback({
            unknownExtension: true,
            message: 'The file extension of the given config does not have a designated loader.'
        });
        return;
    }

    loader(configPath, callback);
}

extend(module.exports, {
    defaultt: defaultt,
    get: get,
    load: load
});
