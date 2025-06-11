const request = require('supertest');
const express = require('express');
const app = require('../src/index');

describe('GET /capabilities/:capability', () => {
  it('should return preferred roles and policy for a known capability', async () => {
    const response = await request(app)
      .get('/capabilities/data_ingest');
    expect(response.statusCode).toBe(200);
    expect(response.body.capability).toBe('data_ingest');
    expect(response.body.preferredRoles).toContain('ROLE-DATA-GATHERER');
  });

  it('should return 404 for an unknown capability', async () => {
    const response = await request(app)
      .get('/capabilities/unknown_capability');
    expect(response.statusCode).toBe(404);
  });
});
