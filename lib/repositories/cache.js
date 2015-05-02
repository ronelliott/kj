'use strict';

var inherits = require('util').inherits,
    extend = require('extend'),
    BaseRepository = require('./base'),
    CacheMixin = require('./mixins').CacheMixin;

function CacheRepository(caller) {
    caller(BaseRepository, this);
}

inherits(CacheRepository, BaseRepository);

extend(CacheRepository.prototype, CacheMixin);

module.exports = CacheRepository;
