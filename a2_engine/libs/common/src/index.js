// Common utility functions for all services

function generateId(prefix = 'id') {
    return `${prefix}-${Math.random().toString(36).substr(2, 9)}`;
}

module.exports = { generateId };
