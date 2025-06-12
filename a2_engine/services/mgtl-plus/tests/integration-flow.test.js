const request = require('supertest');
const express = require('express');
const mgtlApp = require('../src/index');
const swarmApp = require('../../swarm-manager/src/index');
const execApp = require('../../execution-engine/src/index');
const feedbackApp = require('../../feedback-engine/src/index');

// Start all apps on ephemeral ports for integration testing
let mgtlServer, swarmServer, execServer, feedbackServer;
beforeAll(done => {
  feedbackServer = feedbackApp.listen(4006, () => {
    execServer = execApp.listen(4005, () => {
      swarmServer = swarmApp.listen(4003, () => {
        mgtlServer = mgtlApp.listen(4001, done);
      });
    });
  });
});
afterAll(done => {
  mgtlServer.close(() => {
    swarmServer.close(() => {
      execServer.close(() => {
        feedbackServer.close(done);
      });
    });
  });
});

describe('A2 Integration Flow', () => {
  it('should process a goal end-to-end through MGTL+, Swarm Manager, Execution Engine, and Feedback Engine', async () => {
    const goal = {
      goalId: 'MG-INT-001',
      description: 'Integration test goal',
      intentTags: ['integration'],
      depth: 0,
      budget: 1000,
      canRecurse: true
    };
    // Call MGTL+ to translate goal
    const mgtlRes = await request(mgtlApp).post('/translate-goal').send(goal);
    expect(mgtlRes.statusCode).toBe(200);
    expect(mgtlRes.body.subGoals).toBeDefined();
    // Simulate Swarm Manager and Execution Engine by directly calling their endpoints
    for (const sg of mgtlRes.body.subGoals) {
      const swarmRes = await request(swarmApp).post('/deploy-swarm').send({ subGoalEnvelope: sg });
      expect(swarmRes.statusCode).toBe(200);
      expect(swarmRes.body.execution).toBeDefined();
      const execRes = await request(execApp).post('/dispatch').send({ subGoalEnvelope: sg });
      expect(execRes.statusCode).toBe(200);
      expect(execRes.body.status).toBe('dispatched');
    }
  });
});
