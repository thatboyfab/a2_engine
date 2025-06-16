// In-memory store for audit logs
const auditLogs = [];

function storeAuditLog(log) {
  auditLogs.push({ ...log, receivedAt: new Date().toISOString() });
}

function listAuditLogs() {
  return auditLogs;
}

function resetAuditLogs() {
  auditLogs.length = 0;
}

function complianceCheck(payload) {
  // Simple stub: always allow, but log the check
  return { status: 'checked', result: 'ok', checkedAt: new Date().toISOString() };
}

module.exports = { storeAuditLog, listAuditLogs, resetAuditLogs, complianceCheck };
