'use strict';

var utils = require('../utils'),
    extend = utils.extend,
    inherits = utils.inherits,
    redis = utils.redis,
    CacheRepository = require('./').CacheRepository;

function RedisRepository(options) {
    CacheRepository.call(this, options);
}

inherits(RedisRepository, CacheRepository);

RedisRepository.prototype = extend({}, CacheRepository.prototype, {
    transact: function(callback) {
        var client = redis.createClient();
        callback(client);
    },
});

module.exports = {
    RedisRepository: RedisRepository,
};
