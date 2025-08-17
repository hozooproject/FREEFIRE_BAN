// BY LORDHOZOO 2025

// Fixed version with comprehensive error handling
const express = require('express');
const socketIO = require('socket.io');
const https = require('https');
const fs = require('fs');
const path = require('path');

// Initialize application with error handling
try {
  const app = express();
  const server = require('http').createServer(app);
  const io = socketIO(server);

  // Configuration with defaults
  const config = {
    port: process.env.PORT || 8080,
    csrfToken: process.env.CSRF_TOKEN || "default_csrf_token",
    reportUrl: process.env.REPORT_URL || "https://ffsupport.garena.com/hc/en-us/articles/4412928330266-Report-System-Introduction"
  };

  // Ensure required directories exist
  function ensureDirectoryExistence(dirPath) {
    if (!fs.existsSync(dirPath)) {
      fs.mkdirSync(dirPath, { recursive: true });
    }
  }

  // Setup public directory
  ensureDirectoryExistence(path.join(__dirname, 'public'));

  // Create default HTML file if missing
  const htmlFilePath = path.join(__dirname, 'public', 'index.html');
  if (!fs.existsSync(htmlFilePath)) {
    const defaultHtml = `
    <!DOCTYPE html>
    <html>
    <head>
      <title>Report System</title>
      <style>
        body { font-family: Arial, sans-serif; margin: 20px; }
        .container { max-width: 800px; margin: 0 auto; }
        #status { margin-top: 20px; padding: 10px; border: 1px solid #ddd; min-height: 200px; }
      </style>
    </head>
    <body>
      <div class="container">
        <h1>Game Report System</h1>
        <input type="text" id="gameId" placeholder="Enter Game ID">
        <button onclick="submitGameId()">Start Reporting</button>
        <div id="status"></div>
      </div>
      <script src="/socket.io/socket.io.js"></script>
      <script>
        const socket = io();
        function submitGameId() {
          const gameId = document.getElementById('gameId').value;
          fetch('/api/submit', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ gameId })
          });
        }
        socket.on('reportStatus', (data) => {
          const statusDiv = document.getElementById('status');
          statusDiv.innerHTML += `<p>${new Date().toLocaleTimeString()}: ${data.message}</p>`;
        });
      </script>
    </body>
    </html>
    `;
    fs.writeFileSync(htmlFilePath, defaultHtml);
  }

  // Middleware
  app.use(express.static('public'));
  app.use(express.json());

  // Routes
  app.post('/api/submit', (req, res) => {
    try {
      const { gameId } = req.body;
      if (!gameId) {
        return res.status(400).json({ error: "Game ID is required" });
      }
      
      io.emit('reportStatus', { message: `Starting reports for Game ID: ${gameId}` });
      startReporting(gameId);
      res.json({ success: true });
    } catch (error) {
      console.error("Submit error:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  });

  // Reporting function
  async function startReporting(gameId) {
    let reportCount = 0;
    const httpsAgent = new https.Agent({ rejectUnauthorized: false });
    
    const reportInterval = setInterval(async () => {
      try {
        reportCount++;
        const response = await fetch(`${config.reportUrl}?game_id=${gameId}`, {
          agent: httpsAgent,
          headers: {
            'X-CSRF-Token': config.csrfToken,
            'User-Agent': 'Mozilla/5.0'
          }
        });
        
        io.emit('reportStatus', { 
          message: `Report #${reportCount} sent - Status: ${response.status}` 
        });
      } catch (error) {
        io.emit('reportStatus', { 
          message: `Report error: ${error.message}` 
        });
      }
    }, 1000); // 1 second interval between reports

    // Cleanup on client disconnect
    io.on('disconnect', () => {
      clearInterval(reportInterval);
    });
  }

  // Start server
  server.listen(config.port, () => {
    console.log(`Server running on port ${config.port}`);
    console.log(`Access the interface at http://localhost:${config.port}`);
  });

} catch (error) {
  console.error("Application failed to start:", error);
  process.exit(1);
}
