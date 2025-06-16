const request = require('supertest');
const app = require('../src/index');
const { resetSwarms } = require('../src/swarmStore');

jest.mock('axios', () => ({
  post: jest.fn(() => Promise.resolve({ data: { taskId: 't1', status: 'dispatched' } }))
}));

describe('Swarm Manager API', () => {
  beforeEach(() => resetSwarms());

  it('deploys a swarm and lists it', async () => {
    const subGoalEnvelope = {
      subGoalId: 'sg-1',
      recursionMeta: { depth: 1, costBudgetRemaining: 200 },
      roleAssignment: { capability: 'time_series', roleId: 'ROLE-ANALYST' },
      traceMeta: { traceId: 'trace-1', lineage: ['root', 'sg-1'] },
      agentCount: 2
    };
    const res = await request(app)
      .post('/deploy-swarm')
      .send({ subGoalEnvelope });
    expect(res.statusCode).toBe(200);
    expect(res.body.swarmId).toMatch(/^swarm-/);
    expect(res.body.status).toBe('active');
    const listRes = await request(app).get('/swarms');
    expect(listRes.statusCode).toBe(200);
    expect(Array.isArray(listRes.body)).toBe(true);
    expect(listRes.body.length).toBe(1);
    expect(listRes.body[0].swarmId).toBe(res.body.swarmId);
  });

  it('returns error for missing subGoalEnvelope', async () => {
    const res = await request(app).post('/deploy-swarm').send({});
    expect(res.statusCode).toBe(400);
    expect(res.body.error).toMatch(/Missing subGoalEnvelope/);
  });
});
