var crypto = require('crypto');

function sha1(data) {
  var generator = crypto.createHash('sha1');
  generator.update(data);
  return generator.digest('hex');
}

exports.LUA_SCRIPTS = {
  dequeue: "local qname=ARGV[1] local exp=tonumber(ARGV[2]) local key=redis.call('rpoplpush',qname..':queued',qname..':processing') if type(key) == 'string' then local exkey=string.format('%s:tracking:%s',qname,key) redis.call('setex',exkey,exp,'1') local val=redis.call('hget',qname..':data',key) return {key,val} else return false end",
  enqueue: "local qname=ARGV[1] local data=ARGV[2] local shakey=redis.sha1hex(data) redis.call('hset',qname..':data',shakey,data) redis.call('lpush',qname..':queued',shakey) return shakey"
};
exports.LUA_SHA = {
  dequeue: sha1(exports.LUA_SCRIPTS.dequeue),
  enqueue: sha1(exports.LUA_SCRIPTS.enqueue),
};
exports.NOSCRIPT = 'NOSCRIPT';
