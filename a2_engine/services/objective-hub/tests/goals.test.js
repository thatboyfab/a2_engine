const request = require('supertest');
const express = require('express');
const app = require('../src/index');

describe('POST /goals', () => {
  it('should normalize and return a mission goal', async () => {
    const goal = {
      goalId: 'MG-001',
      description: 'Evaluate fiscal state',
      depth: 0,
      budget: 1000,
      canRecurse: true
    };
    const response = await request(app)
      .post('/goals')
      .send(goal);
    expect(response.statusCode).toBe(200);
    expect(response.body.normalizedGoal.goalId).toBe('MG-001');
    expect(response.body.status).toBe('received');
  });
});
