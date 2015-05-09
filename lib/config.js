'use strict';

var async = require('async'),
    extend = require('extend'),
    extname = require('path').extname,
    fs = require('fs'),
    minimist = require('minimist'),
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

function get(paths, defaults, callback) {
    var config,
        used;

    if (is(callback, 'undefined') && is(defaults, 'function')) {
        callback = defaults;
        defaults = defaultt();
    }

    if (is(paths, 'function') && is(defaults, 'undefined') && is(callback, 'undefined')) {
        var argv = minimist(process.argv.slice(2));
        callback = paths;
        defaults = defaultt();
        paths = [
            argv.config,
            argv._[0],
            'config.js',
            'config.json',
            'config.yml',
            'config.yaml'
        ];
    }

    async.eachSeries(paths, function(name, next) {
        if (config || !name) {
            next();
            return;
        }

        load(makePath(name), function(err, loaded) {
            if (err) {
                if (!err.exists) {
                    next();
                    return;
                }

                next(err);
            }

            config = extend(true, {}, defaults, loaded);
            used = name;
            next({ loaded: true });
        });
    }, function(err) {
        if (err.loaded) {
            err = null;
        }

        callback(err, config, used, makePath(used));
    });

    function is(value, kind) {
        return typeof(value) === kind;
    }

    function makePath(name) {
        return path.resolve(path.join(process.cwd(), name));
    }
}

function load(configPath, callback) {
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
    default: defaultt,
    get: get,
    load: load
});
