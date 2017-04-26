var redis = require('redis');
var ReliableQueue = require('../index');
var Promise = require('bluebird');

var r = new ReliableQueue(redis.createClient());
//r.ttl = 600;

let counter = 0;
async function produceTask() {
  try {
    key = await r.enqueue('fisclet2', 'data:' + (counter++));
    console.log('Enqueue with key: ' + key);
  } catch (err) {
    console.log(err);
  } finally {
    Promise.delay(500).then(produceTask);
  }

};

produceTask();
