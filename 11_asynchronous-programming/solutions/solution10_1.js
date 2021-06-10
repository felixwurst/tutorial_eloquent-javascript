// Tracking the scalpel

/* 
The village crows own an old scalpel that they occasionally use on special missions—say, to cut through screen doors or packaging. To be able to quickly track it down, every time the scalpel is moved to another nest, an entry is added to the storage of both the nest that had it and the nest that took it, under the name "scalpel", with its new location as the value.

This means that finding the scalpel is a matter of following the breadcrumb trail of storage entries, until you find a nest where that points at the nest itself.

Write an async function locateScalpel that does this, starting at the nest on which it runs. You can use the anyStorage function defined earlier to access storage in arbitrary nests. The scalpel has been going around long enough that you may assume that every nest has a "scalpel" entry in its data storage.

Next, write the same function again without using async and await.

Do request failures properly show up as rejections of the returned promise in both versions? How?
*/

var bigOak = require('../chapter/crow-tech').bigOak;
var network = require('../chapter/11_async').network;
var anyStorage = require('../chapter/11_async').anyStorage;

async function locateScalpel(nest) {
  // let lines = network(nest).map(async name => {
  //   return name + ': ' + (await anyStorage(nest, name, `chicks in ${year}`));
  // });
  // let lines = network(nest).map(async name => {
  //   return name + ': ' + (await anyStorage(nest, name, `scalpel`));
  // });
  // return (await Promise.all(lines)).join('\n');
  let nextNest = await anyStorage(nest, nest.name, `scalpel`);
  // while (nextNest != nest.name) {
  //   await anyStorage(nest, nextNest, `scalpel`);
  // }
  return nextNest;
}

function locateScalpel2(nest) {
  // Your code here.
}

setTimeout(() => {
  locateScalpel(bigOak).then(console.log);
}, 1000);
// → Butcher Shop
