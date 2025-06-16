const request = require('supertest');
const app = require('../src/index');
const { resetAuditLogs } = require('../src/auditStore');

describe('Governance Hooks API', () => {
  beforeEach(() => resetAuditLogs());

  it('accepts and lists audit logs', async () => {
    const log = { traceId: 'trace-1', event: 'dispatch', details: { foo: 'bar' } };
    const res = await request(app)
      .post('/audit')
      .send(log);
    expect(res.statusCode).toBe(200);
    expect(res.body.status).toBe('received');
    const listRes = await request(app).get('/audit-logs');
    expect(listRes.statusCode).toBe(200);
    expect(Array.isArray(listRes.body)).toBe(true);
    expect(listRes.body.length).toBe(1);
    expect(listRes.body[0].traceId).toBe('trace-1');
  });

  it('returns compliance check result', async () => {
    const res = await request(app)
      .post('/compliance')
      .send({ traceId: 'trace-2', check: 'policy' });
    expect(res.statusCode).toBe(200);
    expect(res.body.status).toBe('checked');
    expect(res.body.result).toBe('ok');
  });
});
