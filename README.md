# redis-reliable-queue
Full-featured reliable queue with NodeJS + Redis, optimized with Redis Lua script engine

# Getting Started

```
npm install --save redis-reliable-queue
```
then
```
var reliable = require('redis-reliable-queue');

var r = reliable(redisClient).ttl(600);

r.enqueue('myqueue', {name: 'Kay', age: 33});

var data = r.dequeue('myqueue');

console.log(data);
```
