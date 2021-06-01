// const connections = [
//   'Church Tower-Sportsgrounds',
//   'Church Tower-Big Maple',
//   'Big Maple-Sportsgrounds',
//   'Big Maple-Woods',
//   "Big Maple-Fabienne's Garden",
//   "Fabienne's Garden-Woods",
//   "Fabienne's Garden-Cow Pasture",
//   'Cow Pasture-Big Oak',
//   'Big Oak-Butcher Shop',
//   'Butcher Shop-Tall Poplar',
//   'Tall Poplar-Sportsgrounds',
//   'Tall Poplar-Chateau',
//   'Chateau-Great Pine',
//   "Great Pine-Jacques' Farm",
//   "Jacques' Farm-Hawthorn",
//   'Great Pine-Hawthorn',
//   "Hawthorn-Gilles' Garden",
//   "Great Pine-Gilles' Garden",
//   "Gilles' Garden-Big Oak",
//   "Gilles' Garden-Butcher Shop",
//   'Chateau-Butcher Shop',
// ];

// let reachable = Object.create(null);
// for (let [from, to] of connections.map(conn => conn.split('-'))) {
//   (reachable[from] || (reachable[from] = [])).push(to);
//   (reachable[to] || (reachable[to] = [])).push(from);
// }
// console.log(reachable);

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
    attempt(1);
  });
}

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
