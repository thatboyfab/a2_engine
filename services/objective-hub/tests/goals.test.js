const request = require('supertest');
const express = require('express');
const app = require('../src/index');
const { resetObjectives } = require('../src/objectiveStore');

describe('Objective Hub API', () => {
  beforeEach(() => resetObjectives());

  it('normalizes and registers a valid goal', async () => {
    const goal = { goalId: 'obj-1', description: 'Test objective' };
    const res = await request(app).post('/goals').send(goal);
    expect(res.statusCode).toBe(200);
    expect(res.body.normalizedGoal.objectiveId).toBe('obj-1');
    const listRes = await request(app).get('/objectives');
    expect(listRes.statusCode).toBe(200);
    expect(Array.isArray(listRes.body)).toBe(true);
    expect(listRes.body.length).toBe(1);
    expect(listRes.body[0].objectiveId).toBe('obj-1');
  });

  it('returns error for missing fields', async () => {
    const res = await request(app).post('/goals').send({});
    expect(res.statusCode).toBe(400);
    expect(res.body.error).toMatch(/Missing required fields/);
  });

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
    expect(response.body.normalizedGoal.objectiveId).toBe('MG-001');
    expect(response.body.status).toBe('received');
  });
});
