'use strict';

var should = require('should'),
    fs = require('fs'),
    isArray = require('util').isArray;

function doExternalRequireTest(path) {
    it('`' + path + '` should not have external requires', function(done) {
        var excludes = [];

        if (isArray(path)) {
            excludes = path.slice(1);
            path = path[0];
        }

        fs.readFile(path, function(err, buffer) {
            should(err).not.be.ok;

            var data = buffer.toString(),
                results = data.match(/require\(\'\w*\'\)/);

            if (results) {
                results = excludes.map(function(exclude) {
                    return "require('" + exclude + "')";
                }).indexOf(results[0]) !== -1 ? null : results;
            }

            should(results).not.be.ok;
            done();
        });
    });
}

module.exports.doExternalRequireTest = doExternalRequireTest;
