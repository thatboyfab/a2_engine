const request = require('supertest');
const app = require('../src/index');

describe('Execution Engine Policy Enforcement', () => {
  it('should reject missing subGoalEnvelope', async () => {
    const response = await request(app).post('/dispatch').send({});
    expect(response.statusCode).toBe(400);
    expect(response.body.error).toMatch(/missing subGoalEnvelope/i);
  });
});
