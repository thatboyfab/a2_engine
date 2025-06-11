const express = require('express');
const mongoose = require('mongoose');
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

// POST /feedback: Submit feedback
app.post('/feedback', async (req, res) => {
    const feedback = new Feedback(req.body);
    await feedback.save();
    res.status(201).json(feedback);
});

// GET /feedback: List all feedback
app.get('/feedback', async (req, res) => {
    const feedbacks = await Feedback.find();
    res.json(feedbacks);
});

app.listen(3000, () => {
    console.log('Feedback Engine service running on port 3000');
});
