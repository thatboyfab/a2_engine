const request = require('supertest');
const express = require('express');
const app = require('../src/index');

describe('POST /deploy-swarm', () => {
  it('should accept a SubGoalEnvelope and return a swarm assignment', async () => {
    const subGoalEnvelope = {
      subGoalId: 'SG-001',
      description: 'Test subgoal',
      intentTags: ['test'],
      canRecurse: true,
      recursionMeta: {
        parentGoalId: 'MG-001',
        depth: 0,
        maxDepth: 3,
        costBudgetRemaining: 1000
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
      .post('/deploy-swarm')
      .send({ subGoalEnvelope });
    expect(response.statusCode).toBe(200);
    expect(response.body.swarmId).toBeDefined();
    expect(response.body.assigned).toBe(true);
  });
});
