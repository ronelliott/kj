'use strict';

var should = require('should'),
    fmt = require('util').format,
    utils = require('../utils');

describe('utils', function() {
    describe('isArray', function() {
        [
            [ undefined, false ],
            [ null, false ],
            [ 'undefined', false ],
            [ true, false ],
            [ {}, false ],
            [ [], true ]
        ].forEach(function(items) {
                var value = items[0],
                    result = items[1];

                it(fmt('should return %s for %s values', result, value), function() {
                    utils.isArray(value).should.equal(result);
                });
            });
    });

    describe('isDef', function() {
        [
            [ undefined, false ],
            [ null, true ],
            [ 'undefined', true ],
            [ true, true ],
            [ {}, true ],
            [ [], true ]
        ].forEach(function(items) {
                var value = items[0],
                    result = items[1];

                it(fmt('should return %s for %s values', result, value), function() {
                    utils.isDef(value).should.equal(result);
                });
            });
    });

    describe('isFunc', function() {
        [
            [ function() {}, true ],
            [ undefined, false ],
            [ null, false ],
            [ 'undefined', false ],
            [ true, false ],
            [ {}, false ],
            [ [], false ]
        ].forEach(function(items) {
                var value = items[0],
                    result = items[1];

                it(fmt('should return %s for %s values', result, value), function() {
                    utils.isFunc(value).should.equal(result);
                });
            });
    });

    describe('isKind', function() {
        [
            [ undefined, 'undefined', true ],
            [ undefined, 'function', false ]
        ].forEach(function(items) {
                var value = items[0],
                    kind = items[1],
                    result = items[2];

                it(fmt('should return %s for value %s and type %s', result, value, kind), function() {
                    utils.isKind(value, kind).should.equal(result);
                });
            });
    });

    describe('isObject', function() {
        [
            [ undefined, false ],
            [ null, false ],
            [ 'undefined', false ],
            [ true, false ],
            [ {}, true ],
            [ [], false ]
        ].forEach(function(items) {
                var value = items[0],
                    result = items[1];

                it(fmt('should return %s for %s values', result, value), function() {
                    utils.isObject(value).should.equal(result);
                });
            });
    });

    describe('isString', function() {
        [
            [ undefined, false ],
            [ null, false ],
            [ 'undefined', true ],
            [ true, false ],
            [ {}, false ],
            [ [], false ]
        ].forEach(function(items) {
                var value = items[0],
                    result = items[1];

                it(fmt('should return %s for %s values', result, value), function() {
                    utils.isString(value).should.equal(result);
                });
            });
    });

    describe('isUndef', function() {
        [
            [ undefined, true ],
            [ null, false ],
            [ 'undefined', false ],
            [ true, false ],
            [ {}, false ],
            [ [], false ]
        ].forEach(function(items) {
                var value = items[0],
                    result = items[1];

                it(fmt('should return %s for %s values', result, value), function() {
                    utils.isUndef(value).should.equal(result);
                });
            });
    });
});
