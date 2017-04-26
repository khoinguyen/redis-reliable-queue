var Promise = require('bluebird');
var redis = require('redis');
var luaScripts   = require('./redis-queue-lua');
var NoResultError = require('./noresult-error');

Promise.promisifyAll(redis.RedisClient.prototype);

var ReliableQueue = class ReliableQueue {
  constructor(redis) {
    if (!redis) {
      throw new TypeError('reliable required RedisClient instance');
    }

    this.redisdb = redis;
    this.expires = 600;
  }

  async executeAsync (command, args) {
    args.unshift(0);
    let ret;

    try {
      ret = await this.redisdb.evalshaAsync(luaScripts.LUA_SHA[command], args);
    } catch (err) {
      if (err.code == luaScripts.NOSCRIPT) {
        console.log('NOSCRIPT - eval instead');
        ret = await this.redisdb.evalAsync(luaScripts.LUA_SCRIPTS[command], args);
      } else {
        throw err;
      }
    }

    if (!ret) {
      throw new NoResultError('No result for ' + command, 'NORESULT');
    }

    return ret;
  }

  set ttl(expires) {
    this.expires = expires;
  }

  enqueue (qname, data) {
    return this.executeAsync('enqueue', [qname, data]);
  }

  dequeue (qname, cb) {
    return this.executeAsync('dequeue', [qname, this.expires]);
  };

  complete (qname, key) {
    // Delete from processing on complete
    return this.redisdb.lremAsync(qname + ':processing', 0, key);
  }

};

module.exports = ReliableQueue;
