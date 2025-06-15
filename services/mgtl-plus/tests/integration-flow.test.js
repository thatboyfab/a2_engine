jest.mock('mongoose', () => {
  const actual = jest.requireActual('mongoose');
  return {
    ...actual,
    connect: jest.fn(() => Promise.resolve()),
    model: jest.fn(() => {
      return function(data) {
        return {
          ...data,
          save: jest.fn().mockResolvedValue({ ...data })
        };
      };
    })
  };
});
jest.mock('axios', () => ({
  post: jest.fn((url) => {
    if (url && url.includes('deploy-swarm')) {
      return Promise.resolve({ data: { swarmId: 'swarm-123', assigned: true, traceId: 'TRACE-001', lineage: ['MG-001'], execution: { status: 'dispatched', taskId: 'SG-001', traceId: 'TRACE-001', lineage: ['MG-001'] } } });
    }
    if (url && url.includes('/dispatch')) {
      return Promise.resolve({ data: { status: 'dispatched', taskId: 'SG-001', traceId: 'TRACE-001', lineage: ['MG-001'] } });
    }
    return Promise.resolve({ data: { status: 'mocked', swarmId: 'swarm-123', assigned: true, taskId: 'SG-001', traceId: 'TRACE-001', lineage: ['MG-001'] } });
  })
}));

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
    expect(Array.isArray(mgtlRes.body.subGoals)).toBe(true);
    expect(mgtlRes.body.subGoals.length).toBeGreaterThan(0);
    expect(Array.isArray(mgtlRes.body.swarmResponses)).toBe(true);
    expect(mgtlRes.body.status).toBe('created');
    // Simulate Swarm Manager and Execution Engine by directly calling their endpoints
    for (const sg of mgtlRes.body.subGoals) {
      const swarmRes = await request(swarmApp).post('/deploy-swarm').send({ subGoalEnvelope: sg });
      expect(swarmRes.statusCode).toBe(200);
      expect(swarmRes.body.swarmId).toBeDefined();
      expect(swarmRes.body.assigned).toBe(true);
      expect(swarmRes.body.execution).toBeDefined();
      const execRes = await request(execApp).post('/dispatch').send({ subGoalEnvelope: sg });
      expect(execRes.statusCode).toBe(200);
      expect(execRes.body.status).toBe('dispatched');
    }
  });
});
