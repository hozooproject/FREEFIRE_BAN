// BY LORDHOZOO 2025


const readline = require('readline');
const axios = require('axios');
const https = require('https');
const os = require('os');
const { exec } = require('child_process');
const fs = require('fs');
const path = require('path');
const express = require('express');
const socketIO = require('socket.io');

// Create Express app and HTTP server
const app = express();
const server = require('http').createServer(app);
const io = socketIO(server);

// Create public directory if not exists
if (!fs.existsSync('public')) {
  fs.mkdirSync('public');
}

// Create default config if not exists
if (!fs.existsSync('config.json')) {
  fs.writeFileSync('config.json', JSON.stringify({
    csrfToken: "hc:meta:server:2dFpdqi-n7ctK-30CZAWPXOP_F7-bHagV-UM5ubvS5h8UpdV5fdyDc5j_1hY_Hz_ghHyaJ17FnxUF5IFvUL16A",
    urls: {
      reportSystem: "https://ffsupport.garena.com/hc/en-us/articles/4412928330266-Report-System-Introduction"
    },
    credentials: {
      username: "hoozoo",
      password: "123456"
    }
  }, null, 2));
}

// Module system with error handling
const modules = {
  logger: fs.existsSync('logger.js') ? require('./logger.js') : { log: console.log },
  config: fs.existsSync('config.json') ? require('./config.json') : {}
};

// Web interface setup
app.use(express.static('public'));
app.use(express.json());

// Serve HTML page
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// API endpoint for game ID submission
app.post('/api/submit', (req, res) => {
  const { gameId } = req.body;
  if (!gameId) {
    return res.status(400).json({ error: 'Game ID is required' });
  }
  
  // Emit to all connected clients
  io.emit('gameIdSubmitted', { gameId });
  startReporting(gameId);
  
  res.json({ success: true, message: 'Reporting started' });
});

// Create HTML file if not exists
if (!fs.existsSync(path.join(__dirname, 'public', 'index.html'))) {
  const htmlContent = `
  <!DOCTYPE html>
  <html lang="en">
  <head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>LORDHOOZOO 2025 REPORT SYSTEM</title>
    <style>
      body {
        background-color: #000;
        color: #ff0000;
        font-family: 'Courier New', monospace;
        margin: 0;
        padding: 20px;
      }
      .container {
        max-width: 800px;
        margin: 0 auto;
        padding: 20px;
        border: 1px solid #ff0000;
      }
      h1 {
        color: #ff0000;
        text-align: center;
      }
      .form-group {
        margin-bottom: 15px;
      }
      input {
        background-color: #222;
        color: #fff;
        border: 1px solid #ff0000;
        padding: 8px;
        width: 100%;
      }
      button {
        background-color: #ff0000;
        color: #000;
        border: none;
        padding: 10px 20px;
        cursor: pointer;
        font-weight: bold;
      }
      #status {
        margin-top: 20px;
        padding: 10px;
        background-color: #111;
        min-height: 100px;
        overflow-y: auto;
      }
    </style>
  </head>
  <body>
    <div class="container">
      <h1>LORDHOOZOO 2025 REPORT SYSTEM</h1>
      <div class="form-group">
        <label for="gameId">Enter Game ID:</label>
        <input type="text" id="gameId" placeholder="Your Game ID">
      </div>
      <button onclick="submitGameId()">START REPORTING</button>
      <div id="status"></div>
    </div>

    <script src="/socket.io/socket.io.js"></script>
    <script>
      const socket = io();
      const statusDiv = document.getElementById('status');
      
      function submitGameId() {
        const gameId = document.getElementById('gameId').value;
        if (!gameId) {
          alert('Please enter a Game ID');
          return;
        }
        
        fetch('/api/submit', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ gameId })
        });
      }
      
      socket.on('gameIdSubmitted', (data) => {
        addStatusMessage(`Started reporting for Game ID: ${data.gameId}`);
      });
      
      socket.on('reportStatus', (data) => {
        addStatusMessage(`[${new Date().toLocaleTimeString()}] ${data.message}`);
      });
      
      function addStatusMessage(message) {
        const p = document.createElement('p');
        p.textContent = message;
        statusDiv.appendChild(p);
        statusDiv.scrollTop = statusDiv.scrollHeight;
      }
    </script>
  </body>
  </html>
  `;

  fs.writeFileSync(path.join(__dirname, 'public', 'index.html'), htmlContent);
}

// Clear console with style
function clearConsole() {
  if (os.platform() === 'win32') {
    exec('cls');
  } else {
    exec('clear');
  }
  console.log('\x1b[36m%s\x1b[0m', '==============================================');
  console.log('\x1b[33m%s\x1b[0m', '           LORDHOOZOO 2025 REPORT SYSTEM      ');
  console.log('\x1b[36m%s\x1b[0m', '==============================================');
}

// Create HTTPS agent
const agent = new https.Agent({
  keepAlive: true,
  rejectUnauthorized: false,
  timeout: 0,
  maxSockets: Infinity
});

// Enhanced headers
const headers = {
  'Content-Type': 'application/json',
  'X-CSRF-Token': modules.config.csrfToken || "default_token",
  'User-Agent': 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
};

// Reporting function with improved error handling
async function startReporting(gameId) {
  let counter = 0;
  
  const sendStatus = (message) => {
    io.emit('reportStatus', { message });
    console.log(message);
  };

  while(true) {
    try {
      counter++;
      const now = new Date();
      
      sendStatus(`Sending report #${counter} for Game ID: ${gameId} at ${now.toLocaleTimeString()}`);
      
      const response = await axios.get(modules.config.urls?.reportSystem || "https://ffsupport.garena.com/hc/en-us/articles/4412928330266-Report-System-Introduction", {
        httpsAgent: agent,
        headers: headers,
        params: { game_id: gameId },
        timeout: 5000
      });

      sendStatus(`Report #${counter} successful - Status: ${response.status}`);
      
      await new Promise(resolve => setTimeout(resolve, Math.floor(Math.random() * 400) + 100));
      
    } catch (error) {
      sendStatus(`Error: ${error.message}`);
      await new Promise(resolve => setTimeout(resolve, 1000));
    }
  }
}

// Start server with port checking
function startServer(port = 8080) {
  server.listen(port, () => {
    clearConsole();
    console.log('\x1b[32m%s\x1b[0m', `Server running on http://localhost:${port}`);
    console.log('\x1b[33m%s\x1b[0m', 'Use the web interface to submit Game IDs');
  }).on('error', (err) => {
    if (err.code === 'EADDRINUSE') {
      console.log(`Port ${port} is in use, trying port ${port + 1}`);
      startServer(port + 1);
    } else {
      console.error('Server error:', err);
    }
  });
}

startServer();

// Cleanup on exit
process.on('SIGINT', () => {
  console.log('\nShutting down server...');
  process.exit();
});
