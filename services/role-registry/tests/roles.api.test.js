const request = require('supertest');
const mongoose = require('mongoose');
const app = require('../src/index');

beforeAll(async () => {
  await mongoose.connect('mongodb://localhost:27017/role_registry', { useNewUrlParser: true, useUnifiedTopology: true });
});
afterAll(async () => {
  await mongoose.connection.db.dropDatabase();
  await mongoose.disconnect();
});

describe('Role Registry API', () => {
  it('creates and lists roles', async () => {
    const role = { name: 'Analyst', capabilities: ['nlp', 'data-analysis'], permissions: ['read', 'write'] };
    const res = await request(app)
      .post('/roles')
      .send(role);
    expect(res.statusCode).toBe(201);
    expect(res.body.name).toBe('Analyst');
    const listRes = await request(app).get('/roles');
    expect(listRes.statusCode).toBe(200);
    expect(Array.isArray(listRes.body)).toBe(true);
    expect(listRes.body.length).toBe(1);
    expect(listRes.body[0].name).toBe('Analyst');
  });
});
