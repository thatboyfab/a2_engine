const request = require('supertest');
const express = require('express');
const axios = require('axios');

jest.mock('axios');
axios.post.mockImplementation(() => Promise.resolve({ data: {} }));

const app = require('../src/index');

describe('POST /dispatch', () => {
  it('should accept a SubGoalEnvelope and return a dispatched status', async () => {
    const subGoalEnvelope = {
      subGoalId: 'SG-001',
      description: 'Test subgoal',
      intentTags: ['test'],
      canRecurse: true,
      recursionMeta: {
        parentGoalId: 'MG-001',
        depth: 1,
        maxDepth: 3,
        costBudgetRemaining: 500
      },
      roleAssignment: {
        roleId: 'ROLE-ANALYST',
        capability: 'time_series',
        confidence: 1.0
      },
      learningPath: [],
      traceMeta: {
        lineage: ['MG-001'],
        traceId: 'TRACE-001',
        timestamp: new Date().toISOString()
      }
    };
    const response = await request(app)
      .post('/dispatch')
      .send({ subGoalEnvelope });
    expect(response.statusCode).toBe(200);
    expect(response.body.taskId).toBe('SG-001');
    expect(response.body.status).toBe('dispatched');
    expect(response.body.traceId).toBe('TRACE-001');
  });
});
