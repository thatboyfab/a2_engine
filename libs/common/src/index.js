// Common utility functions for all services

function generateId(prefix = 'id') {
    return `${prefix}-${Math.random().toString(36).substr(2, 9)}`;
}

function createTraceId(prefix = 'TRACE') {
    return `${prefix}-${Math.random().toString(36).substr(2, 8)}`;
}

function logWithTrace(message, traceId, extra = {}) {
    console.log(`[${new Date().toISOString()}][${traceId}] ${message}`, extra);
}

module.exports = { generateId, createTraceId, logWithTrace };
