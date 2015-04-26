'use strict';

var extend = require('extend'),
    extname = require('path').extname,
    fs = require('fs'),
    yaml = require('yaml').eval;

function jsLoader(path, callback) {
    if (extname(path) === '.js') {
        path = path.replace('.js', '');
    }

    var config = require(path);

    if (typeof(config) === 'function') {
        config(callback);
        return;
    }

    callback && callback(null, config);
}

function yamlLoader(path, callback) {
    fs.readFile(path, function(err, raw) {
        if (err) {
            callback && callback(err);
            return;
        }

        callback && callback(null, yaml(raw.toString()));
    });
}

extend(module.exports, {
    get: function(path, defaults, callback) {
        if (typeof(callback) === 'undefined' && typeof(defaults) === 'function') {
            callback = defaults;
            defaults = {};
        }

        this.load(path, function(err, config) {
            if (err) {
                callback && callback(err);
                return;
            }

            config = extend(true, {}, defaults, config);
            callback && callback(null, config);
        });
    },
    load: function(path, callback) {
        if (!fs.existsSync(path)) {
            callback && callback({ exists: false, message: 'The given path does not exist.' });
            return;
        }

        var extension = extname(path).replace('.', ''),
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

        loader(path, callback);
    }
});
