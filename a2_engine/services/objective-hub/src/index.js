const express = require('express');
const app = express();
app.use(express.json());

// POST /goals: Intake and normalize a mission goal
app.post('/goals', (req, res) => {
    // TODO: Normalize and validate the incoming goal
    const { goalId, description, depth = 0, budget = 1000, canRecurse = true } = req.body;
    // Attach lineage if spawned recursively
    const normalizedGoal = {
        goalId,
        description,
        depth,
        budget,
        canRecurse,
        lineage: req.body.lineage || [goalId]
    };
    res.json({ normalizedGoal, status: 'received' });
});

// GET /health: Health check endpoint
app.get('/health', (req, res) => res.json({ status: 'ok', service: 'objective-hub' }));

app.listen(3000, () => {
    console.log('Objective Hub service running on port 3000');
});

// Export for testing
module.exports = app;
