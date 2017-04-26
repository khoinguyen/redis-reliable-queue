var redis = require('redis');
var ReliableQueue = require('../index');
var Promise = require('bluebird');

var r = new ReliableQueue(redis.createClient());
//r.ttl = 600;

var processTask = async function () {
  let task;
  let completed;
  try {
    task = await r.dequeue('fisclet2');
    console.log('task comming');
    console.log('key: ' + task[0]);
    console.log('data: ' + task[1]);

    completed = await r.complete('fisclet2', task[0]);
    console.log('removed ' + completed);
  } catch (err) {
    if (err.code != 'NORESULT') {
      console.log(err);
    }
  } finally {
    Promise.delay(1000).then(processTask);
  }

};

processTask();
