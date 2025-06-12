const express = require('express');
const bodyParser = require('body-parser');
const { SubGoalEnvelopeSchema, validateSubGoalEnvelope } = require('../../../libs/shared-libraries/src/subgoalEnvelope');
const axios = require('axios');

const app = express();
app.use(bodyParser.json());

const MAX_DEPTH = 3;
const MIN_BUDGET = 100;

// POST /translate-goal: Translates a high-level goal into one or more SubGoalEnvelopes and sends to Swarm Manager
app.post('/translate-goal', async (req, res) => {
    const { goalId, description, depth = 0, budget = 1000, canRecurse = true, intentTags = [], lineage = [] } = req.body;
    // Policy enforcement
    if (depth >= MAX_DEPTH) {
        return res.status(400).json({ error: 'Max recursion depth reached' });
    }
    if (budget < MIN_BUDGET) {
        return res.status(400).json({ error: 'Insufficient budget for recursion' });
    }
    // Recursive delegation: create subgoals (simulate with 2 subgoals)
    const subGoals = [1,2].map(i => {
        const subGoalId = `SG-${Math.random().toString(36).substr(2, 6)}`;
        return {
            subGoalId,
            description: `${description} (subgoal ${i})`,
            intentTags,
            canRecurse,
            recursionMeta: {
                parentGoalId: goalId,
                depth: depth + 1,
                maxDepth: MAX_DEPTH,
                costBudgetRemaining: budget / 2
            },
            roleAssignment: {
                roleId: 'ROLE-ANALYST',
                capability: 'time_series',
                confidence: 1.0
            },
            learningPath: [],
            traceMeta: {
                lineage: [...lineage, goalId],
                traceId: `TRACE-${Math.random().toString(36).substr(2, 8)}`,
                timestamp: new Date().toISOString()
            }
        };
    });
    // Validate all subgoals
    for (const sg of subGoals) {
        if (!validateSubGoalEnvelope(sg)) {
            return res.status(400).json({ error: 'Invalid SubGoalEnvelope', subGoal: sg });
        }
    }
    // Real HTTP call to Swarm Manager for each subgoal
    try {
        const results = await Promise.all(subGoals.map(async (sg) => {
            const response = await axios.post('http://swarm-manager:3000/deploy-swarm', { subGoalEnvelope: sg });
            return response.data;
        }));
        res.json({ subGoals, swarmResponses: results, status: 'created', lineage: [...lineage, goalId] });
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
