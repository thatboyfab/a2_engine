const express = require('express');
const bodyParser = require('body-parser');
const { SubGoalEnvelopeSchema, validateSubGoalEnvelope } = require('../../../libs/shared-libraries/src/subgoalEnvelope');
const axios = require('axios');

const app = express();
app.use(bodyParser.json());

// POST /translate-goal: Translates a high-level goal into a SubGoalEnvelope and sends to Swarm Manager
app.post('/translate-goal', async (req, res) => {
    const { goalId, description, depth = 0, budget = 1000, canRecurse = true } = req.body;
    const subGoalEnvelope = {
        subGoalId: `SG-${Math.random().toString(36).substr(2, 6)}`,
        description: description || '',
        intentTags: req.body.intentTags || [],
        canRecurse,
        recursionMeta: {
            parentGoalId: goalId,
            depth,
            maxDepth: 3,
            costBudgetRemaining: budget
        },
        roleAssignment: {
            roleId: 'ROLE-ANALYST',
            capability: 'time_series',
            confidence: 1.0
        },
        learningPath: [],
        traceMeta: {
            lineage: [goalId],
            traceId: `TRACE-${Math.random().toString(36).substr(2, 8)}`,
            timestamp: new Date().toISOString()
        }
    };
    if (!validateSubGoalEnvelope(subGoalEnvelope)) {
        return res.status(400).json({ error: 'Invalid SubGoalEnvelope' });
    }
    // Stub: send to Swarm Manager (simulate with try/catch)
    try {
        // await axios.post('http://swarm-manager:3000/deploy-swarm', { subGoalEnvelope });
        // For now, just return the envelope
        res.json({ subGoalEnvelope, status: 'created' });
    } catch (err) {
        res.status(500).json({ error: 'Failed to send to Swarm Manager', details: err.message });
    }
});

app.listen(3000, () => {
    console.log('MGTL+ service running on port 3000');
});

// Export for testing
module.exports = app;
module.exports._testHandler = app._router.stack.find(r => r.route && r.route.path === '/translate-goal').route.stack[0].handle;
