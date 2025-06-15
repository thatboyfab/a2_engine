const request = require('supertest');
const express = require('express');

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
jest.mock('axios', () => ({ post: jest.fn(() => Promise.resolve({ data: {} })) }));

const app = require('../src/index');

describe('POST /feedback', () => {
  it('should accept feedback and return the created feedback object', async () => {
    const feedback = {
      agentId: 'agent-001',
      performance: 0.95,
      timestamp: new Date().toISOString()
    };
    const response = await request(app)
      .post('/feedback')
      .send(feedback);
    expect(response.statusCode).toBe(201);
    expect(response.body.agentId).toBe('agent-001');
    expect(response.body.performance).toBe(0.95);
  });
});
