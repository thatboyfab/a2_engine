// In-memory store for swarms
const swarms = [];

function addSwarm(swarm) {
  swarms.push(swarm);
}

function listSwarms() {
  return swarms;
}

function resetSwarms() {
  swarms.length = 0;
}

module.exports = { addSwarm, listSwarms, resetSwarms };
