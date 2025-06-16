const request = require('supertest');
const mongoose = require('mongoose');
const app = require('../src/index');

beforeAll(async () => {
  await mongoose.connect('mongodb://localhost:27017/feedback_engine', { useNewUrlParser: true, useUnifiedTopology: true });
});
afterAll(async () => {
  await mongoose.connection.db.dropDatabase();
  await mongoose.disconnect();
});

describe('Feedback Engine API', () => {
  it('submits and lists feedback', async () => {
    const feedback = { agentId: 'agent-1', performance: 0.9, timestamp: new Date() };
    const res = await request(app)
      .post('/feedback')
      .send(feedback);
    expect(res.statusCode).toBe(201);
    expect(res.body.agentId).toBe('agent-1');
    const listRes = await request(app).get('/feedback');
    expect(listRes.statusCode).toBe(200);
    expect(Array.isArray(listRes.body)).toBe(true);
    expect(listRes.body.length).toBe(1);
    expect(listRes.body[0].agentId).toBe('agent-1');
  });
});
