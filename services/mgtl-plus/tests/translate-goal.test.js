const request = require('supertest');
const express = require('express');
const bodyParser = require('body-parser');
const { validateSubGoalEnvelope } = require('../../../libs/shared-libraries/src/subgoalEnvelope');
const axios = require('axios');

jest.mock('axios');

// Import the app from index.js or create a test instance
const app = express();
app.use(bodyParser.json());
app.post('/translate-goal', require('../src/index')._testHandler || ((req, res) => res.status(501).end()));

describe('POST /translate-goal', () => {
  it('should create valid SubGoalEnvelopes', async () => {
    const goal = { goalId: 'MG-001', description: 'Test goal', intentTags: ['test'], depth: 0, budget: 1000 };
    axios.post.mockResolvedValue({ data: { swarmId: 'swarm-123', assigned: true, traceId: 'TRACE-001', lineage: ['MG-001'] } });
    const response = await request(app).post('/translate-goal').send(goal);
    expect(response.statusCode).toBe(200);
    expect(Array.isArray(response.body.subGoals)).toBe(true);
    expect(response.body.subGoals.length).toBeGreaterThan(0);
    response.body.subGoals.forEach(sg => expect(validateSubGoalEnvelope(sg)).toBe(true));
    expect(Array.isArray(response.body.swarmResponses)).toBe(true);
    expect(response.body.status).toBe('created');
  });
});

describe('Policy enforcement', () => {
  it('should reject if max recursion depth is reached', async () => {
    const goal = { goalId: 'MG-002', description: 'Deep goal', depth: 3, budget: 1000 };
    const response = await request(app).post('/translate-goal').send(goal);
    expect(response.statusCode).toBe(400);
    expect(response.body.error).toMatch(/max recursion depth/i);
  });
  it('should reject if budget is too low', async () => {
    const goal = { goalId: 'MG-003', description: 'Low budget', depth: 0, budget: 50 };
    const response = await request(app).post('/translate-goal').send(goal);
    expect(response.statusCode).toBe(400);
    expect(response.body.error).toMatch(/insufficient budget/i);
  });
});
