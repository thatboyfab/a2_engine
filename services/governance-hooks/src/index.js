const express = require('express');
const app = express();
app.use(express.json());
const { logWithTrace } = require('../../../libs/common/src/index');
const { storeAuditLog, listAuditLogs, complianceCheck } = require('./auditStore');

// Health endpoint
app.get('/health', (req, res) => res.json({ status: 'ok', service: 'governance-hooks' }));

// POST /audit: Accept audit logs
app.post('/audit', (req, res) => {
    logWithTrace('Audit log received', req.body.traceId || 'NO-TRACE', req.body);
    storeAuditLog(req.body);
    res.json({ status: 'received', log: req.body });
});

// GET /audit-logs: List all audit logs
app.get('/audit-logs', (req, res) => {
    res.json(listAuditLogs());
});

// POST /compliance: Compliance check or override
app.post('/compliance', (req, res) => {
    logWithTrace('Compliance check', req.body.traceId || 'NO-TRACE', req.body);
    const result = complianceCheck(req.body);
    res.json(result);
});

if (require.main === module) {
    app.listen(3000, () => {
        console.log('Governance Hooks service running on port 3000');
    });
}

module.exports = app;
