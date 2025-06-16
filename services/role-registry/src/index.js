const express = require('express');
const mongoose = require('mongoose');
const app = express();
app.use(express.json());

// Connect to MongoDB (use env var for containerized deployment)
mongoose.connect(process.env.MONGO_URL || 'mongodb://localhost:27017/role_registry', { useNewUrlParser: true, useUnifiedTopology: true });

// Role schema and model
const roleSchema = new mongoose.Schema({
    name: String,
    capabilities: [String],
    permissions: [String]
});
const Role = mongoose.model('Role', roleSchema);

// POST /roles: Create a new role
app.post('/roles', async (req, res) => {
    const role = new Role(req.body);
    await role.save();
    res.status(201).json(role);
});

// GET /roles: List all roles
app.get('/roles', async (req, res) => {
    const roles = await Role.find();
    res.json(roles);
});

// Health check endpoint
app.get('/health', (req, res) => res.json({ status: 'ok', service: 'role-registry' }));

if (require.main === module) {
    app.listen(3000, () => {
        console.log('Role Registry service running on port 3000');
    });
}

module.exports = app;
