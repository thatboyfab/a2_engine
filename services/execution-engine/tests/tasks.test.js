const request = require('supertest');
const app = require('../src/index');
const { resetTasks } = require('../src/taskStore');

describe('Execution Engine API', () => {
  beforeEach(() => resetTasks());

  it('dispatches a task and lists it', async () => {
    const subGoalEnvelope = {
      subGoalId: 'sg-1',
      traceMeta: { traceId: 'trace-1', lineage: ['root', 'sg-1'] }
    };
    const res = await request(app)
      .post('/dispatch')
      .send({ subGoalEnvelope });
    expect(res.statusCode).toBe(200);
    expect(res.body.taskId).toBe('sg-1');
    const listRes = await request(app).get('/tasks');
    expect(listRes.statusCode).toBe(200);
    expect(Array.isArray(listRes.body)).toBe(true);
    expect(listRes.body.length).toBe(1);
    expect(listRes.body[0].taskId).toBe('sg-1');
  });

  it('returns error for missing subGoalEnvelope', async () => {
    const res = await request(app).post('/dispatch').send({});
    expect(res.statusCode).toBe(400);
    expect(res.body.error).toMatch(/Missing subGoalEnvelope/);
  });
});
