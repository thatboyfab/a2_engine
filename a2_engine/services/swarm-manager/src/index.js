const express = require('express');
const axios = require('axios');
const app = express();
app.use(express.json());

const MAX_DEPTH = 3;
const MIN_BUDGET = 100;

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
    const traceId = subGoalEnvelope.traceMeta.traceId;
    try {
        // Real HTTP call to Execution Engine
        const execRes = await axios.post('http://execution-engine:3000/dispatch', { subGoalEnvelope });
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

app.listen(3000, () => {
    console.log('Swarm Manager service running on port 3000');
});

// Export for testing
module.exports = app;
