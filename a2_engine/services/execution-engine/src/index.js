const express = require('express');
const app = express();
app.use(express.json());

// POST /dispatch: Dispatch a task to an agent
app.post('/dispatch', (req, res) => {
    // TODO: Implement task dispatch logic
    res.json({ taskId: 'task-123', status: 'dispatched' });
});

// GET /tasks: List all tasks
app.get('/tasks', (req, res) => {
    // TODO: Return list of tasks
    res.json([]);
});

app.listen(3000, () => {
    console.log('Execution Engine service running on port 3000');
});
