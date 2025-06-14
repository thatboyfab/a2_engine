const express = require('express');
const mongoose = require('mongoose');
const { logWithTrace } = require('../../../libs/common/src/index');
const axios = require('axios');
const app = express();
app.use(express.json());

// Connect to MongoDB (mock connection string)
mongoose.connect('mongodb://localhost:27017/feedback_engine', { useNewUrlParser: true, useUnifiedTopology: true });

// Feedback schema and model
const feedbackSchema = new mongoose.Schema({
    agentId: String,
    performance: Number,
    timestamp: Date
});
const Feedback = mongoose.model('Feedback', feedbackSchema);

// Environment variables for Governance Hooks and MGTL+ URLs
const GOVERNANCE_HOOKS_URL = process.env.GOVERNANCE_HOOKS_URL || 'http://governance-hooks:3000';
const MGTL_PLUS_URL = process.env.MGTL_PLUS_URL || 'http://mgtl-plus:3000';

// POST /feedback: Submit feedback and trigger replanning if needed
app.post('/feedback', async (req, res) => {
    const feedback = new Feedback(req.body);
    await feedback.save();
    logWithTrace('Feedback received', feedback.traceId || 'NO-TRACE', feedback);
    // Report audit to Governance Hooks (stub)
    try {
        await axios.post(`${GOVERNANCE_HOOKS_URL}/audit`, feedback);
    } catch (e) { /* ignore for now */ }
    // If anomaly detected, trigger replanning (stub)
    if (feedback.performance < 0.5) {
        // await axios.post(`${MGTL_PLUS_URL}/translate-goal`, { ... });
        logWithTrace('Anomaly detected, replanning triggered', feedback.traceId || 'NO-TRACE', feedback);
    }
    res.status(201).json(feedback);
});

// GET /feedback: List all feedback
app.get('/feedback', async (req, res) => {
    const feedbacks = await Feedback.find();
    res.json(feedbacks);
});

// Health check endpoint
app.get('/health', (req, res) => res.json({ status: 'ok', service: 'feedback-engine' }));

app.listen(3000, () => {
    console.log('Feedback Engine service running on port 3000');
});
