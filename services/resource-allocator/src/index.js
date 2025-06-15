const express = require('express');
const app = express();
app.use(express.json());
const { allocateResource, listAllocations } = require('./allocator');

// POST /allocate: Allocate resources to a task
app.post('/allocate', (req, res) => {
    const { agentId, resourceType, amountRequested, priority } = req.body;
    const result = allocateResource(agentId, resourceType, amountRequested, priority);
    if (result.error) {
        return res.status(400).json({ error: result.error });
    }
    res.json(result);
});

// GET /allocations: List all allocations
app.get('/allocations', (req, res) => {
    res.json(listAllocations());
});

// GET /health: Health check endpoint
app.get('/health', (req, res) => res.json({ status: 'ok', service: 'resource-allocator' }));

if (require.main === module) {
    app.listen(3000, () => {
        console.log('Resource Allocator service running on port 3000');
    });
}

module.exports = app;
