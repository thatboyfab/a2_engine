const express = require('express');
const app = express();
app.use(express.json());

// POST /deploy-swarm: Accepts a SubGoalEnvelope and returns a stubbed response
app.post('/deploy-swarm', (req, res) => {
    const { subGoalEnvelope } = req.body;
    // TODO: Validate and process the envelope, spawn agents
    res.json({ swarmId: `swarm-${Math.random().toString(36).substr(2, 6)}`, assigned: true, subGoalEnvelope });
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
