const express = require('express');
const app = express();
app.use(express.json());

// POST /allocate: Allocate resources to a task
app.post('/allocate', (req, res) => {
    // TODO: Implement resource allocation logic
    res.json({ allocationId: 'alloc-123', status: 'allocated' });
});

// GET /allocations: List all allocations
app.get('/allocations', (req, res) => {
    // TODO: Return list of allocations
    res.json([]);
});

// GET /health: Health check endpoint
app.get('/health', (req, res) => res.json({ status: 'ok', service: 'resource-allocator' }));

if (require.main === module) {
    app.listen(3000, () => {
        console.log('Resource Allocator service running on port 3000');
    });
}

module.exports = app;
