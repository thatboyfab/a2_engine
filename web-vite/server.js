// Minimal Node.js glue server for SSR or API proxy (if needed)
const express = require('express');
const path = require('path');
const app = express();

const PORT = process.env.PORT || 3011;
const staticPath = path.join(__dirname, 'dist');

// Serve static files from Vite build
app.use(express.static(staticPath));

// Fallback to index.html for SPA routing
app.get('*', (req, res) => {
  res.sendFile(path.join(staticPath, 'index.html'));
});

app.listen(PORT, () => {
  console.log(`Vite+React app running on http://localhost:${PORT}`);
});
