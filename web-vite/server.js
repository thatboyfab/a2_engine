// Minimal Node.js glue server for SSR or API proxy (if needed)
const express = require('express');
const path = require('path');
const app = express();

const PORT = process.env.PORT || 3011;
const staticPath = path.join(__dirname, 'dist');

// Serve static files from Vite build
app.use(express.static(staticPath));
// Debug logging middleware
app.use((req, res, next) => {
  console.log(`[DEBUG] Incoming request: ${req.method} ${req.url}`);
  next();
});

// Fallback to index.html for SPA routing
// Enhanced catch-all with error logging
app.use('*', (req, res, next) => {
  try {
    res.sendFile(path.join(staticPath, 'index.html'));
  } catch (err) {
    console.error('[ERROR] Catch-all route error:', err);
    next(err);
  }
});

app.listen(PORT, () => {
  console.log(`Vite+React app running on http://localhost:${PORT}`);
});
