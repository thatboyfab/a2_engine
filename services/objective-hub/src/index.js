const express = require('express');
const app = express();
app.use(express.json());
const { normalizeAndValidateGoal, registerObjective, listObjectives } = require('./objectiveStore');

// POST /goals: Intake and normalize a mission goal
app.post('/goals', (req, res) => {
    const normalized = normalizeAndValidateGoal(req.body);
    if (normalized.error) {
        return res.status(400).json({ error: normalized.error });
    }
    registerObjective(normalized);
    res.json({ normalizedGoal: normalized, status: 'received' });
});

// GET /objectives: List all objectives
app.get('/objectives', (req, res) => {
    res.json(listObjectives());
});

// GET /health: Health check endpoint
app.get('/health', (req, res) => res.json({ status: 'ok', service: 'objective-hub' }));

if (require.main === module) {
    app.listen(3000, () => {
        console.log('Objective Hub service running on port 3000');
    });
}

// Export for testing
module.exports = app;
