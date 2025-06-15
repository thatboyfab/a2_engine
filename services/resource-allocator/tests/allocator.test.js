const request = require('supertest');
const app = require('../src/index');
const { resetPools } = require('../src/allocator');

describe('Resource Allocator API', () => {
  beforeEach(() => resetPools());

  it('allocates resources successfully', async () => {
    const res = await request(app)
      .post('/allocate')
      .send({ agentId: 'agent-1', resourceType: 'cpu', amountRequested: 10 });
    expect(res.statusCode).toBe(200);
    expect(res.body.allocationId).toBeDefined();
    expect(res.body.amountAllocated).toBe(10);
  });

  it('returns error for unknown resource type', async () => {
    const res = await request(app)
      .post('/allocate')
      .send({ agentId: 'agent-1', resourceType: 'unknown', amountRequested: 10 });
    expect(res.statusCode).toBe(400);
    expect(res.body.error).toMatch(/Unknown resource type/);
  });

  it('returns error for insufficient resources', async () => {
    const res = await request(app)
      .post('/allocate')
      .send({ agentId: 'agent-1', resourceType: 'cpu', amountRequested: 1000 });
    expect(res.statusCode).toBe(400);
    expect(res.body.error).toMatch(/Insufficient resources/);
  });

  it('lists allocations', async () => {
    await request(app)
      .post('/allocate')
      .send({ agentId: 'agent-1', resourceType: 'cpu', amountRequested: 10 });
    const res = await request(app).get('/allocations');
    expect(res.statusCode).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
    expect(res.body.length).toBe(1);
    expect(res.body[0].agentId).toBe('agent-1');
  });
});
