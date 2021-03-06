var bigOak = require('./crow-tech').bigOak;
// console.log(bigOak);

// ---------------------------------------- Callbacks ----------------------------------------
var defineRequestType = require('./crow-tech').defineRequestType;

defineRequestType('note', (nest, content, source, done) => {
  console.log(`${nest.name} received note: ${content}`);
  done();
});

// ---------------------------------------- Promises ----------------------------------------
function storage(nest, name) {
  return new Promise(resolve => {
    nest.readStorage(name, result => resolve(result));
  });
}

// storage(bigOak, 'enemies').then(value => console.log('Got', value));
// -> Got ["Farmer Jacques' dog", 'The butcher', 'That one-legged jackdaw', 'The boy with the airgun'];

// ---------------------------------------- Networks are hard ----------------------------------------
var Timeout = class Timeout extends Error {};

function request(nest, target, type, content) {
  return new Promise((resolve, reject) => {
    let done = false;
    function attempt(n) {
      nest.send(target, type, content, (failed, value) => {
        done = true;
        if (failed) reject(failed);
        else resolve(value);
      });
      setTimeout(() => {
        if (done) return;
        else if (n < 3) attempt(n + 1);
        else reject(new Timeout('Timed out'));
      }, 250);
    }
    attempt(0);
  });
}

function requestType(name, handler) {
  defineRequestType(name, (nest, content, source, callback) => {
    try {
      Promise.resolve(handler(nest, content, source)).then(
        response => callback(null, response),
        failure => callback(failure)
      );
    } catch (exception) {
      callback(exception);
    }
  });
}

requestType('ping', () => 'pong');

// ---------------------------------------- Collections of promises ----------------------------------------

function availableNeighbors(nest) {
  let requests = nest.neighbors.map(neighbor => {
    return request(nest, neighbor, 'ping').then(
      () => true,
      () => false
    );
  });
  return Promise.all(requests).then(result => {
    // result = [ true, true, true ]
    // filters out the neighbours who are not reachable
    return nest.neighbors.filter((_, i) => result[i]);
  });
}

// availableNeighbors(bigOak).then(console.log);
// -> [ 'Cow Pasture', 'Butcher Shop', "Gilles' Garden" ]

// ---------------------------------------- Network flooding ----------------------------------------
var everywhere = require('./crow-tech').everywhere;

everywhere(nest => {
  nest.state.gossip = [];
});

function sendGossip(nest, message, exceptFor = null) {
  nest.state.gossip.push(message);
  for (let neighbor of nest.neighbors) {
    if (neighbor == exceptFor) continue;
    request(nest, neighbor, 'gossip', message);
  }
}

requestType('gossip', (nest, message, source) => {
  if (nest.state.gossip.includes(message)) return;
  console.log(`${nest.name} received gossip '${message}' from ${source}`);
  sendGossip(nest, message, source);
});

// sendGossip(bigOak, 'Kids with airgun in the park');
// -> Cow Pasture received gossip 'Kids with airgun in the park' from Big Oak
// -> Butcher Shop received gossip 'Kids with airgun in the park' from Big Oak
// ...

// ---------------------------------------- Message routing ----------------------------------------
requestType('connections', (nest, {name, neighbors}, source) => {
  let connections = nest.state.connections;
  if (JSON.stringify(connections.get(name)) == JSON.stringify(neighbors))
    return;
  connections.set(name, neighbors);
  broadcastConnections(nest, name, source);
});

function broadcastConnections(nest, name, exceptFor = null) {
  for (let neighbor of nest.neighbors) {
    if (neighbor == exceptFor) continue;
    request(nest, neighbor, 'connections', {
      name,
      neighbors: nest.state.connections.get(name),
    });
  }
}

everywhere(nest => {
  nest.state.connections = new Map();
  nest.state.connections.set(nest.name, nest.neighbors);
  // Map { 'Church Tower' => [ 'Sportsgrounds', 'Big Maple' ] }
  // Map {'Sportsgrounds' => [ 'Church Tower', 'Big Maple', 'Tall Poplar' ] }
  // ...
  broadcastConnections(nest, nest.name);
});

function findRoute(from, to, connections) {
  let work = [{at: from, via: null}];
  for (let i = 0; i < work.length; i++) {
    let {at, via} = work[i];
    for (let next of connections.get(at) || []) {
      if (next == to) return via;
      if (!work.some(w => w.at == next)) {
        work.push({at: next, via: via || next});
      }
    }
  }
  return null;
}

function routeRequest(nest, target, type, content) {
  if (nest.neighbors.includes(target)) {
    return request(nest, target, type, content);
  } else {
    let via = findRoute(nest.name, target, nest.state.connections);
    if (!via) throw new Error(`No route to ${target}`);
    return request(nest, via, 'route', {target, type, content});
  }
}

requestType('route', (nest, {target, type, content}) => {
  return routeRequest(nest, target, type, content);
});

// setTimeout(() => {
//   routeRequest(bigOak, 'Chateau', 'note', 'Incoming jackdaws!');
// }, 1000);
// -> Chateau received note: Incoming jackdaws!

// ---------------------------------------- Async functions ----------------------------------------
requestType('storage', (nest, name) => storage(nest, name));

// version 1
// function findInStorage(nest, name) {
//   return storage(nest, name).then(found => {
//     if (found != null) return found;
//     else return findInRemoteStorage(nest, name);
//   });
// }

function network(nest) {
  return Array.from(nest.state.connections.keys());
}

function findInRemoteStorage(nest, name) {
  let sources = network(nest).filter(n => n != nest.name);
  function next() {
    if (sources.length == 0) {
      return Promise.reject(new Error('Not found'));
    } else {
      let source = sources[Math.floor(Math.random() * sources.length)];
      sources = sources.filter(n => n != source);
      return routeRequest(nest, source, 'storage', name).then(
        value => (value != null ? value : next()),
        next
      );
    }
  }
  return next();
}

// version 2
async function findInStorage(nest, name) {
  let local = await storage(nest, name);
  if (local != null) return local;
  let sources = network(nest).filter(n => n != nest.name);
  while (sources.length > 0) {
    let source = sources[Math.floor(Math.random() * sources.length)];
    sources = sources.filter(n => n != source);
    try {
      let found = await routeRequest(nest, source, 'storage', name);
      if (found != null) return found;
    } catch (_) {}
  }
  throw new Error('Not found');
}

// findInStorage(bigOak, 'events on 2017-12-21').then(console.log);
// -> Deep snow. Butcher's garbage can fell over. We chased off the ravens from Saint-Vulbas.

// ---------------------------------------- Asynchronous bugs ----------------------------------------
var Group = class Group {
  constructor() {
    this.members = [];
  }
  add(m) {
    this.members.add(m);
  }
};

exports.anyStorage = function anyStorage(nest, source, name) {
  if (source == nest.name) return storage(nest, name);
  else return routeRequest(nest, source, 'storage', name);
};

// version 1 -> outputs only the last value
// async function chicks(nest, year) {
//   let list = '';
//   await Promise.all(
//     network(nest).map(async name => {
//       list += `${name}: ${await anyStorage(nest, name, `chicks in ${year}`)}\n`;
//     })
//   );
//   return list;
// }

// version 2
async function chicks(nest, year) {
  let lines = network(nest).map(async name => {
    return name + ': ' + (await anyStorage(nest, name, `chicks in ${year}`));
  });
  return (await Promise.all(lines)).join('\n');
}

// setTimeout(() => {
//   chicks(bigOak, 2017).then(console.log);
// }, 1000);
// -> Big Oak: 1
// -> Butcher Shop: 5
// ...
