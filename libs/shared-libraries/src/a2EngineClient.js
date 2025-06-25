// a2EngineClient.js
// Abstraction layer for all a2_engine interactions
// Usage: Import and use methods for all a2_engine API calls

const axios = require('axios');

const A2_ENGINE_BASE_URL = process.env.A2_ENGINE_BASE_URL || 'http://localhost:3000';

// Example: Get status from a2_engine
async function getStatus() {
  return axios.get(`${A2_ENGINE_BASE_URL}/status`);
}

// Add more methods as needed for your integration points

module.exports = {
  getStatus,
  // add more exported methods here
};
