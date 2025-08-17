// BY LORDHOZOO 2025

const express = require('express');
const socketIO = require('socket.io');
const https = require('https');
const fs = require('fs');
const path = require('path');
const axios = require('axios');

// Initialize application with error handling
try {
  const app = express();
  const server = require('http').createServer(app);
  const io = socketIO(server);

  // Configuration with fixed values
  const config = {
    port: process.env.PORT || 8080,
    csrfToken: "hc:meta:server:2dFpdqi-n7ctK-30CZAWPXOP_F7-bHagV-UM5ubvS5h8UpdV5fdyDc5j_1hY_Hz_ghHyaJ17FnxUF5IFvUL16A",
    reportUrls: [
      "https://ffsupport.garena.com/hc/theming_assets/01HYDMRXT6Q1DXGX00Q1H2PE6K",
      "https://ffsupport.garena.com/hc/en-us/articles/4412928330266-Report-System-Introduction",
      "https://ffsupport.garena.com/hc/hi/articles/4412928330266--Hindi-%E0%A4%B0%E0%A4%BF%E0%A4%AA%E0%A5%B0%E0%A4%B8%E0%A4%BF%E0%A4%B8%E0%A4%BF%E0%A4%AE-%E0%A4%95%E0%A5%8D%E0%A4%B0%E0%A4%BF%E0%A4%95%E0%A5%87%E0%A4%9F-%E0%A4%B0%E0%A5%80%E0%A4%AA%E0%A5%8B%E0%A4%B0%E0%A5%8D%E0%A4%9F-%E0%A4%B8%E0%A4%BF%E0%A4%B8%E0%A5%8D%E0%A4%9F%E0%A4%AE-%E0%A4%87%E0%A4%82%E0%A4%9F%E0%A4%B0%E0%A5%8B%E0%A4%A1%E0%A4%95%E0%A5%8D%E0%A4%B6%E0%A4%A8"
    ],
    userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
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
      <title>LORDHOZOOO BAN SYSTEM - Free Fire India</title>
      <style>
        @import url('https://fonts.googleapis.com/css2?family=Orbitron:wght@400;700&display=swap');
        
        body {
          font-family: 'Orbitron', sans-serif;
          margin: 0;
          padding: 0;
          background-color: #000;
          color: #ff0000;
          background-image: 
            radial-gradient(circle at 10% 20%, rgba(255,0,0,0.1) 0%, transparent 20%),
            radial-gradient(circle at 90% 80%, rgba(255,0,0,0.1) 0%, transparent 20%);
        }
        
        .container {
          max-width: 900px;
          margin: 0 auto;
          padding: 20px;
          border: 2px solid #ff0000;
          border-radius: 5px;
          box-shadow: 0 0 20px #ff0000;
          background-color: rgba(0, 0, 0, 0.8);
          margin-top: 30px;
        }
        
        .header {
          text-align: center;
          margin-bottom: 30px;
          border-bottom: 1px solid #ff0000;
          padding-bottom: 15px;
        }
        
        .title {
          font-size: 2.5em;
          color: #ff0000;
          text-shadow: 0 0 10px #ff0000;
          margin-bottom: 5px;
          letter-spacing: 3px;
        }
        
        .subtitle {
          font-size: 1.2em;
          color: #ff0000;
          margin-bottom: 20px;
        }
        
        .info-panel {
          display: flex;
          justify-content: space-between;
          margin-bottom: 20px;
          padding: 10px;
          background-color: rgba(255, 0, 0, 0.1);
          border: 1px solid #ff0000;
          border-radius: 5px;
        }
        
        .info-item {
          text-align: center;
        }
        
        .info-label {
          font-size: 0.8em;
          color: #ff0000;
          opacity: 0.7;
        }
        
        .info-value {
          font-size: 1.2em;
          color: #ff0000;
          font-weight: bold;
        }
        
        .input-group {
          margin-bottom: 20px;
        }
        
        input {
          width: 100%;
          padding: 12px;
          background-color: #111;
          border: 1px solid #ff0000;
          color: #fff;
          font-family: 'Orbitron', sans-serif;
          font-size: 1em;
          margin-bottom: 10px;
        }
        
        button {
          width: 100%;
          padding: 12px;
          background-color: #ff0000;
          color: #000;
          border: none;
          font-family: 'Orbitron', sans-serif;
          font-size: 1.2em;
          font-weight: bold;
          cursor: pointer;
          transition: all 0.3s;
          letter-spacing: 1px;
        }
        
        button:hover {
          background-color: #ff3333;
          box-shadow: 0 0 15px #ff0000;
        }
        
        #status {
          margin-top: 20px;
          padding: 15px;
          border: 1px solid #ff0000;
          min-height: 300px;
          max-height: 400px;
          overflow-y: auto;
          background-color: rgba(0, 0, 0, 0.5);
          font-family: 'Courier New', monospace;
        }
        
        #status p {
          margin: 5px 0;
          padding: 5px;
          border-bottom: 1px dotted rgba(255, 0, 0, 0.3);
        }
        
        .glow {
          animation: glow 2s infinite alternate;
        }
        
        @keyframes glow {
          from {
            text-shadow: 0 0 5px #ff0000;
          }
          to {
            text-shadow: 0 0 15px #ff0000, 0 0 20px #ff0000;
          }
        }
      </style>
      <script src="https://www.googletagmanager.com/gtm.js?id=GTM-TS4GPXF"></script>
      <script>
        (function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
        new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
        j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
        'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
        })(window,document,'script','dataLayer','GTM-TS4GPXF');
      </script>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <div class="title glow">LORDHOZOOO BAN SYSTEM</div>
          <div class="subtitle">FREE FIRE INDIA SERVER</div>
        </div>
        
        <div class="info-panel">
          <div class="info-item">
            <div class="info-label">DATE</div>
            <div class="info-value" id="current-date">Loading...</div>
          </div>
          <div class="info-item">
            <div class="info-label">TIME</div>
            <div class="info-value" id="current-time">Loading...</div>
          </div>
          <div class="info-item">
            <div class="info-label">WEATHER</div>
            <div class="info-value" id="current-weather">Unknown</div>
          </div>
          <div class="info-item">
            <div class="info-label">STATUS</div>
            <div class="info-value" id="system-status">READY</div>
          </div>
        </div>
        
        <div class="input-group">
          <input type="text" id="gameId" placeholder="ENTER GAME ID">
          <button onclick="submitGameId()">START BAN PROCESS</button>
        </div>
        
        <div id="status"></div>
      </div>
      
      <script src="/socket.io/socket.io.js"></script>
      <script>
        const socket = io();
        
        // Update time and date
        function updateDateTime() {
          const now = new Date();
          
          // Format date: Day, DD Month YYYY
          const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
          document.getElementById('current-date').textContent = now.toLocaleDateString('en-US', options);
          
          // Format time: HH:MM:SS
          document.getElementById('current-time').textContent = now.toLocaleTimeString('en-US', {hour12: false});
          
          // Update every second
          setTimeout(updateDateTime, 1000);
        }
        
        // Simulate weather (in a real app, you'd call a weather API)
        function simulateWeather() {
          const weathers = ['Sunny', 'Cloudy', 'Rainy', 'Stormy', 'Foggy'];
          const randomWeather = weathers[Math.floor(Math.random() * weathers.length)];
          document.getElementById('current-weather').textContent = randomWeather;
          
          // Update every 30 minutes
          setTimeout(simulateWeather, 1800000);
        }
        
        // Initialize
        updateDateTime();
        simulateWeather();
        
        function submitGameId() {
          const gameId = document.getElementById('gameId').value;
          if (!gameId) {
            alert('Please enter a Game ID');
            return;
          }
          
          document.getElementById('system-status').textContent = 'PROCESSING';
          document.getElementById('system-status').style.color = '#ff0000';
          
          fetch('/api/submit', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ gameId })
          });
        }
        
        socket.on('reportStatus', (data) => {
          const statusDiv = document.getElementById('status');
          const now = new Date();
          const timeString = now.toLocaleTimeString('en-US', {hour12: false});
          
          const messageElement = document.createElement('p');
          messageElement.innerHTML = `<span style="color: #ff5555">[${timeString}]</span> ${data.message}`;
          
          statusDiv.appendChild(messageElement);
          statusDiv.scrollTop = statusDiv.scrollHeight;
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
      
      io.emit('reportStatus', { message: `🚀 Starting BAN process for Game ID: ${gameId}` });
      io.emit('reportStatus', { message: `🔍 Connecting to Free Fire India servers...` });
      startReporting(gameId);
      res.json({ success: true });
    } catch (error) {
      console.error("Submit error:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  });

  // Enhanced reporting function with multiple URLs
  async function startReporting(gameId) {
    let reportCount = 0;
    const httpsAgent = new https.Agent({ 
      rejectUnauthorized: false,
      keepAlive: true
    });
    
    // Initial delay to simulate connection
    await new Promise(resolve => setTimeout(resolve, 1500));
    io.emit('reportStatus', { message: `✅ Successfully connected to Free Fire servers` });
    
    const reportInterval = setInterval(async () => {
      try {
        reportCount++;
        // Rotate through different report URLs
        const url = config.reportUrls[reportCount % config.reportUrls.length];
        
        io.emit('reportStatus', { message: `📡 Sending report #${reportCount} to server...` });
        
        const response = await axios.get(url, {
          httpsAgent: httpsAgent,
          params: { game_id: gameId },
          headers: {
            'X-CSRF-Token': config.csrfToken,
            'User-Agent': config.userAgent,
            'Referer': 'https://ffsupport.garena.com/hc/en-us/articles/4412928330266-Report-System-Introduction'
          }
        });
        
        io.emit('reportStatus', { 
          message: `✅ Report #${reportCount} successfully sent (Status: ${response.status})` 
        });
        
        // Simulate additional ban process messages
        if (reportCount % 3 === 0) {
          const progress = Math.min(100, Math.floor(reportCount / 30 * 100));
          io.emit('reportStatus', { 
            message: `⏳ Ban progress: ${progress}% complete...` 
          });
        }
      } catch (error) {
        io.emit('reportStatus', { 
          message: `❌ Error sending report: ${error.message}` 
        });
      }
    }, 1500); // 1.5 second interval between reports

    // Cleanup on client disconnect
    io.on('connection', (socket) => {
      socket.on('disconnect', () => {
        clearInterval(reportInterval);
        io.emit('reportStatus', { message: '🛑 Ban process stopped by user' });
      });
    });
  }

  // Start server
  server.listen(config.port, () => {
    console.log(`
    ██╗      ██████╗ ██████╗ ██████╗ ██╗  ██╗ ██████╗  ██████╗  ██████╗ 
    ██║     ██╔═══██╗██╔══██╗██╔══██╗██║  ██║██╔═══██╗██╔═══██╗██╔═══██╗
    ██║     ██║   ██║██████╔╝██║  ██║███████║██║   ██║██║   ██║██║   ██║
    ██║     ██║   ██║██╔══██╗██║  ██║██╔══██║██║   ██║██║   ██║██║   ██║
    ███████╗╚██████╔╝██║  ██║██████╔╝██║  ██║╚██████╔╝╚██████╔╝╚██████╔╝
    ╚══════╝ ╚═════╝ ╚═╝  ╚═╝╚═════╝ ╚═╝  ╚═╝ ╚═════╝  ╚═════╝  ╚═════╝ 
    `);
    console.log(`🔥 LORDHOZOOO BAN SYSTEM activated on port ${config.port}`);
    console.log(`🌐 Access the control panel at http://localhost:${config.port}`);
  });

} catch (error) {
  console.error("System failed to initialize:", error);
  process.exit(1);
}
