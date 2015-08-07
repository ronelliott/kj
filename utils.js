'use strict';

/**
 * checks if the given item is an array
 * @static
 * @param {Object} item - the item to check
 * @returns {Boolean} true if the item is an array, false otherwise
 */
function isArray(item) {
    return Array.isArray(item);
}

/**
 * checks if the given item is not undefined
 * @static
 * @param item
 * @returns {boolean}
 */
function isDef(item) {
    return !isUndef(item);
}

/**
 * checks if the given item is a function
 * @static
 * @param {Object} item - the item to check
 * @returns {Boolean} true if the item is a function, false otherwise
 */
function isFunc(item) {
    return isKind(item, 'function');
}

/**
 * checks if the item is of the given type
 * @static
 * @param {Object} item - the item to check
 * @param {String} kind - the type expected
 * @returns {Boolean} true if the item is of the type expected, false otherwise
 */
function isKind(item, kind) {
    return typeof(item) === kind;
}

/**
 * checks if the given item is an object
 * @static
 * @param {Object} item - the item to check
 * @returns {Boolean} true if the item is an object, false otherwise
 */
function isObject(item) {
    return item !== null && !isArray(item) && isKind(item, 'object');
}

/**
 * checks if the given item is a string
 * @static
 * @param {Object} item - the item to check
 * @returns {Boolean} true if the item is an object, false otherwise
 */
function isString(item) {
    return isKind(item, 'string');
}

/**
 * checks if the given item is undefined
 * @static
 * @param {Object} item - the item to check
 * @returns {Boolean} true if the item is undefined, false otherwise
 */
function isUndef(item) {
    return isKind(item, 'undefined');
}

module.exports = {
    isArray: isArray,
    isDef: isDef,
    isFunc: isFunc,
    isKind: isKind,
    isObject: isObject,
    isString: isString,
    isUndef: isUndef
};
