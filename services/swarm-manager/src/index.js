const express = require('express');
const axios = require('axios');
const { logWithTrace } = require('../../../libs/common/src/index');
const { addSwarm, listSwarms } = require('./swarmStore');
const app = express();
app.use(express.json());

const MAX_DEPTH = 3;
const MIN_BUDGET = 100;
const EXEC_ENGINE_URL = process.env.EXEC_ENGINE_URL || 'http://execution-engine:3000';

// Health check endpoint
app.get('/health', (req, res) => res.json({ status: 'ok', service: 'swarm-manager' }));

// Add capability/role check before swarm assignment
const allowedCapabilities = ['time_series', 'data_ingest']; // In real use, fetch from Capability Registry
const allowedRoles = ['ROLE-ANALYST', 'ROLE-DATA-GATHERER'];

// POST /deploy-swarm: Accepts a SubGoalEnvelope, enforces policy, and calls Execution Engine
app.post('/deploy-swarm', async (req, res) => {
    const { subGoalEnvelope } = req.body;
    if (!subGoalEnvelope) return res.status(400).json({ error: 'Missing subGoalEnvelope' });
    // Policy enforcement
    if (subGoalEnvelope.recursionMeta.depth > MAX_DEPTH) {
        return res.status(400).json({ error: 'Max depth exceeded' });
    }
    if (subGoalEnvelope.recursionMeta.costBudgetRemaining < MIN_BUDGET) {
        return res.status(400).json({ error: 'Insufficient budget' });
    }
    // Enforce role/capability check
    if (!allowedCapabilities.includes(subGoalEnvelope.roleAssignment.capability) || !allowedRoles.includes(subGoalEnvelope.roleAssignment.roleId)) {
        return res.status(400).json({ error: 'Role or capability not allowed', subGoalEnvelope });
    }
    const traceId = subGoalEnvelope.traceMeta.traceId;
    try {
        // Use environment variable for Execution Engine URL
        const execRes = await axios.post(`${EXEC_ENGINE_URL}/dispatch`, { subGoalEnvelope });
        res.json({ swarmId: `swarm-${Math.random().toString(36).substr(2, 6)}`, assigned: true, traceId, lineage: subGoalEnvelope.traceMeta.lineage, execution: execRes.data });
    } catch (err) {
        res.status(500).json({ error: 'Failed to dispatch to Execution Engine', details: err.message });
    }
});

// GET /swarms: List all swarms
app.get('/swarms', (req, res) => {
    // TODO: Return list of swarms
    res.json([]);
});

if (require.main === module) {
    app.listen(3000, () => {
        console.log('Swarm Manager service running on port 3000');
    });
}

// Export for testing
module.exports = app;
