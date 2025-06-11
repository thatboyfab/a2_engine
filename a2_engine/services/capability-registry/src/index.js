const express = require('express');
const app = express();
app.use(express.json());

// In-memory capability-role map
const capabilityMap = {
    data_ingest: {
        preferredRoles: ['ROLE-DATA-GATHERER'],
        maxInstances: 5,
        defaultBudget: 200
    },
    time_series: {
        preferredRoles: ['ROLE-ANALYST'],
        maxInstances: 3,
        defaultBudget: 300
    }
};

// GET /capabilities/:capability - Get preferred roles and policy for a capability
app.get('/capabilities/:capability', (req, res) => {
    const cap = req.params.capability;
    if (!capabilityMap[cap]) return res.status(404).json({ error: 'Not found' });
    res.json({ capability: cap, ...capabilityMap[cap] });
});

app.listen(3000, () => {
    console.log('Capability Registry service running on port 3000');
});

// Export for testing
module.exports = app;
