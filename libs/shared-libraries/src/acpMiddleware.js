// acpMiddleware.js
// Shared Access Control Policy (ACP) middleware for all services
// Usage: Import and use as Express middleware on protected routes

module.exports = function acpMiddleware(req, res, next) {
  // TODO: Implement ACP logic (role, permission, etc.)
  // For now, this is a pass-through (no-op)
  next();
};
