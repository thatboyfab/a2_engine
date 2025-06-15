// In-memory store for objectives and subgoals
const objectives = [];
const subgoals = [];

function normalizeAndValidateGoal(goal) {
  // Basic validation and normalization per spec
  if (!goal.goalId || !goal.description) {
    return { error: 'Missing required fields: goalId, description' };
  }
  const normalized = {
    objectiveId: goal.goalId,
    title: goal.title || goal.description.slice(0, 32),
    description: goal.description,
    issuer: goal.issuer || 'system',
    priority: goal.priority || 'medium',
    status: 'received',
    tags: goal.tags || [],
    createdAt: new Date().toISOString()
  };
  return normalized;
}

function registerObjective(obj) {
  objectives.push(obj);
}

function listObjectives() {
  return objectives;
}

function resetObjectives() {
  objectives.length = 0;
}

module.exports = { normalizeAndValidateGoal, registerObjective, listObjectives, resetObjectives };
