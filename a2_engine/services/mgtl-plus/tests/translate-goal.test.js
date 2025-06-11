const request = require('supertest');
const express = require('express');
const bodyParser = require('body-parser');
const { validateSubGoalEnvelope } = require('../../../libs/shared-libraries/src/subgoalEnvelope');

// Import the app from index.js or create a test instance
const app = express();
app.use(bodyParser.json());
app.post('/translate-goal', require('../src/index')._testHandler || ((req, res) => res.status(501).end()));

describe('POST /translate-goal', () => {
  it('should create a valid SubGoalEnvelope', async () => {
    const goal = { goalId: 'MG-001', description: 'Test goal', intentTags: ['test'], depth: 0, budget: 1000 };
    const response = await request(app).post('/translate-goal').send(goal);
    expect(response.statusCode).toBe(200);
    expect(response.body.subGoalEnvelope).toBeDefined();
    expect(validateSubGoalEnvelope(response.body.subGoalEnvelope)).toBe(true);
  });
});
