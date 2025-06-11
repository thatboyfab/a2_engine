const request = require('supertest');
const express = require('express');
const app = require('../src/index');

describe('POST /dispatch', () => {
  it('should accept a task and return a dispatched status', async () => {
    const task = { taskId: 'task-001', agentId: 'agent-001', payload: {} };
    const response = await request(app)
      .post('/dispatch')
      .send(task);
    expect(response.statusCode).toBe(200);
    expect(response.body.taskId).toBeDefined();
    expect(response.body.status).toBe('dispatched');
  });
});
