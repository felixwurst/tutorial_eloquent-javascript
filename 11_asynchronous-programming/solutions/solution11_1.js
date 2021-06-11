// Tracking the scalpel

/* 
The village crows own an old scalpel that they occasionally use on special missions—say, to cut through screen doors or packaging. To be able to quickly track it down, every time the scalpel is moved to another nest, an entry is added to the storage of both the nest that had it and the nest that took it, under the name "scalpel", with its new location as the value.

This means that finding the scalpel is a matter of following the breadcrumb trail of storage entries, until you find a nest where that points at the nest itself.

Write an async function locateScalpel that does this, starting at the nest on which it runs. You can use the anyStorage function defined earlier to access storage in arbitrary nests. The scalpel has been going around long enough that you may assume that every nest has a "scalpel" entry in its data storage.

Next, write the same function again without using async and await.

Do request failures properly show up as rejections of the returned promise in both versions? How?
*/

var bigOak = require('../chapter/crow-tech').bigOak;
var anyStorage = require('../chapter/11_async').anyStorage;

async function locateScalpel(nest) {
  let oldLocation = nest.name;
  let newLocation = await anyStorage(nest, nest.name, `scalpel`);
  while (oldLocation !== newLocation) {
    console.log(`from ${oldLocation} to ${newLocation}`);
    oldLocation = newLocation;
    newLocation = await anyStorage(nest, oldLocation, `scalpel`);
  }
  return newLocation;
}

// locateScalpel(bigOak).then(console.log);
// -> Butcher Shop

function loopFunction(nest, nestName) {
  return new Promise((resolve, reject) => {
    return anyStorage(nest, nestName, `scalpel`);
  });
}

function locateScalpel2(nest) {
  console.log('Hello');
  // let oldLocation = nest.name;
  return new Promise((resolve, reject) => {
    return loopFunction(nest, nest.name).then(newLocation => {
      console.log(newLocation);
      // if (nest.name == newLocation) {
      //   console.log('same:', nest.name, newLocation);
      // } else {
      //   console.log('not same:', nest.name, newLocation);
      //   loopFunction(nest, newLocation);
      // }
    });
  });
}

// locateScalpel2(bigOak).then(data => {
//   console.log(data);
// });
locateScalpel2(bigOak);
// -> Butcher Shop
