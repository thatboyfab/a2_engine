// In-memory resource pools and allocations for rapid prototyping
const resourcePools = {
  cpu: { total: 100, available: 100 },
  memory: { total: 1024, available: 1024 },
  budget: { total: 10000, available: 10000 }
};

const allocations = [];
const quotas = {};

function allocateResource(agentId, resourceType, amountRequested, priority = 5) {
  const pool = resourcePools[resourceType];
  if (!pool) return { error: 'Unknown resource type' };
  if (amountRequested > pool.available) return { error: 'Insufficient resources' };
  pool.available -= amountRequested;
  const allocation = {
    allocationId: `alloc-${Date.now()}-${Math.floor(Math.random()*1000)}`,
    agentId,
    resourceType,
    amountAllocated: amountRequested,
    expiresAt: new Date(Date.now() + 60 * 60 * 1000).toISOString(),
    priority
  };
  allocations.push(allocation);
  return allocation;
}

function listAllocations() {
  return allocations;
}

function resetPools() {
  resourcePools.cpu.available = resourcePools.cpu.total;
  resourcePools.memory.available = resourcePools.memory.total;
  resourcePools.budget.available = resourcePools.budget.total;
  allocations.length = 0;
}

module.exports = { resourcePools, allocations, allocateResource, listAllocations, resetPools };
