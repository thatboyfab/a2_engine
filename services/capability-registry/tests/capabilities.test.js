const request = require('supertest');
const express = require('express');
const app = require('../src/index');

describe('GET /capabilities/:capability', () => {
  beforeAll(() => { console.log('Starting Capability Registry tests'); });
  afterAll(() => { console.log('Finished Capability Registry tests'); });
  it('should return preferred roles and policy for a known capability', async () => {
    console.log('Testing known capability');
    const response = await request(app)
      .get('/capabilities/data_ingest');
    console.log('Response:', response.body);
    expect(response.statusCode).toBe(200);
    expect(response.body.capability).toBe('data_ingest');
    expect(response.body.preferredRoles).toContain('ROLE-DATA-GATHERER');
  });

  it('should return 404 for an unknown capability', async () => {
    console.log('Testing unknown capability');
    const response = await request(app)
      .get('/capabilities/unknown_capability');
    console.log('Response:', response.body);
    expect(response.statusCode).toBe(404);
  });
});
