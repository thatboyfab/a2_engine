const express = require('express');
const { logWithTrace } = require('../../../libs/common/src/index');
const axios = require('axios');
const app = express();
app.use(express.json());

const FEEDBACK_ENGINE_URL = process.env.FEEDBACK_ENGINE_URL || 'http://feedback-engine:3000';
const GOVERNANCE_HOOKS_URL = process.env.GOVERNANCE_HOOKS_URL || 'http://governance-hooks:3000';

// Health check endpoint
app.get('/health', (req, res) => res.json({ status: 'ok', service: 'execution-engine' }));

// POST /dispatch: Accepts a SubGoalEnvelope, simulates task execution, and returns status
app.post('/dispatch', async (req, res) => {
    const { subGoalEnvelope } = req.body;
    if (!subGoalEnvelope) return res.status(400).json({ error: 'Missing subGoalEnvelope' });
    const taskId = subGoalEnvelope.subGoalId;
    const traceId = subGoalEnvelope.traceMeta.traceId;
    try {
        // Simulate task execution
        const metrics = {
            agentId: 'agent-001',
            performance: Math.random(),
            traceId,
            timestamp: new Date().toISOString(),
            subGoalComplete: true
        };
        logWithTrace('Task dispatched', traceId, { subGoalEnvelope });
        // Report audit to Governance Hooks (stub)
        try {
            await axios.post(`${GOVERNANCE_HOOKS_URL}/audit`, { event: 'dispatch', traceId, subGoalEnvelope });
        } catch (e) { /* ignore for now */ }
        // Send feedback to Feedback Engine
        await axios.post(`${FEEDBACK_ENGINE_URL}/feedback`, metrics);
        res.json({ taskId, status: 'dispatched', traceId, lineage: subGoalEnvelope.traceMeta.lineage });
    } catch (err) {
        res.status(500).json({ error: 'Failed to report feedback', details: err.message });
    }
});

// GET /tasks: List all tasks
app.get('/tasks', (req, res) => {
    // TODO: Return list of tasks
    res.json([]);
});

app.listen(3000, () => {
    console.log('Execution Engine service running on port 3000');
});
