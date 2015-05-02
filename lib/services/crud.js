'use strict';

var extend = require('extend'),
    util = require('util'),
    format = util.format,
    inherits = util.inherits,
    BaseService = require('./base'),
    CrudMixin = require('./mixins').CrudMixin;

function CrudService(caller, params, resolver) {
    caller(BaseService, this);

    var repo = params.repository;

    if (!repo) {
        throw new Error('Repository not defined on route!');
    }

    var Repository = resolver(repo);

    if (!Repository) {
        throw new Error('Repository `%s` not found!', repo);
    }

    this.repo = new Repository();
}

inherits(CrudService, BaseService);

extend(CrudService.prototype, CrudMixin);

module.exports = CrudService;
