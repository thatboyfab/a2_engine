const request = require('supertest');
const app = require('../src/index');

describe('Swarm Manager Policy Enforcement', () => {
  it('should reject subgoals with excessive depth', async () => {
    const subGoalEnvelope = {
      subGoalId: 'SG-DEPTH',
      description: 'Too deep',
      intentTags: [],
      canRecurse: true,
      recursionMeta: { parentGoalId: 'MG-001', depth: 4, maxDepth: 3, costBudgetRemaining: 1000 },
      roleAssignment: { roleId: 'ROLE-ANALYST', capability: 'time_series', confidence: 1.0 },
      learningPath: [],
      traceMeta: { lineage: ['MG-001'], traceId: 'TRACE-DEPTH', timestamp: new Date().toISOString() }
    };
    const response = await request(app).post('/deploy-swarm').send({ subGoalEnvelope });
    expect(response.statusCode).toBe(400);
    expect(response.body.error).toMatch(/max depth/i);
  });
  it('should reject subgoals with insufficient budget', async () => {
    const subGoalEnvelope = {
      subGoalId: 'SG-BUDGET',
      description: 'Low budget',
      intentTags: [],
      canRecurse: true,
      recursionMeta: { parentGoalId: 'MG-001', depth: 1, maxDepth: 3, costBudgetRemaining: 50 },
      roleAssignment: { roleId: 'ROLE-ANALYST', capability: 'time_series', confidence: 1.0 },
      learningPath: [],
      traceMeta: { lineage: ['MG-001'], traceId: 'TRACE-BUDGET', timestamp: new Date().toISOString() }
    };
    const response = await request(app).post('/deploy-swarm').send({ subGoalEnvelope });
    expect(response.statusCode).toBe(400);
    expect(response.body.error).toMatch(/insufficient budget/i);
  });
});
