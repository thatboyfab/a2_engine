// Shared library functions for all services

function validatePayload(payload, requiredFields) {
    for (const field of requiredFields) {
        if (!(field in payload)) {
            return false;
        }
    }
    return true;
}

module.exports = { validatePayload };
