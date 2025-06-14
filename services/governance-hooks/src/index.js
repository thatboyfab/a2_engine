const express = require('express');
const app = express();
app.use(express.json());
const { logWithTrace } = require('../../../libs/common/src/index');

// Health endpoint
app.get('/health', (req, res) => res.json({ status: 'ok', service: 'governance-hooks' }));

// POST /audit: Accept audit logs
app.post('/audit', (req, res) => {
    logWithTrace('Audit log received', req.body.traceId || 'NO-TRACE', req.body);
    // TODO: Store or forward audit logs
    res.json({ status: 'received', log: req.body });
});

// POST /compliance: Compliance check or override
app.post('/compliance', (req, res) => {
    logWithTrace('Compliance check', req.body.traceId || 'NO-TRACE', req.body);
    // TODO: Implement compliance logic
    res.json({ status: 'checked', result: 'ok' });
});

app.listen(3000, () => {
    console.log('Governance Hooks service running on port 3000');
});

module.exports = app;
