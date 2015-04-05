'use strict';

var utils = require('../utils'),
    extend = utils.extend,
    inherits = utils.inherits,
    BaseService = require('./').BaseService,
    Repositories = require('../repositories');

function CRUDService(context) {
    BaseService.call(this);
    this.context = context;
    var repoConfig = context.req.query.repository,
        repoName = repoConfig.name,
        repoArgs = extend({}, repoConfig.args),
        repositories = Repositories.get(context.working),
        Repository = repositories[repoName];

    if (!Repository) {
        throw new Error('Repository `' + repoName + '` not found!');
    }

    context.args = repoArgs;
    this.repo = new Repository(context);
}

inherits(CRUDService, BaseService);

CRUDService.prototype = extend({}, BaseService.prototype, {
    create: function(values, callback) {
        this.repo.create(values, callback);
    },

    delete: function(id, callback) {
        this.repo.delete(id, callback);
    },

    list: function(callback) {
        this.repo.find(callback);
    },

    update: function(id, values, callback) {
        this.repo.create(id, values, callback);
    },
});

module.exports = {
    CRUDService: CRUDService,
};
