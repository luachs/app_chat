const WebSocket = require('ws');
const http = require('http');
const fs = require('fs');
const path = require('path');

const PORT = process.env.PORT || 8080;

// Tạo HTTP server phục vụ client.html
const server = http.createServer((req, res) => {
  if (req.url === '/') {
    const filePath = path.join(__dirname, 'client.html');
    const content = fs.readFileSync(filePath, 'utf-8');
    res.writeHead(200, { 'Content-Type': 'text/html' });
    res.end(content);
  } else {
    res.writeHead(404);
    res.end('404 Not Found');
  }
});

// Tạo WebSocket server
const wss = new WebSocket.Server({ server });

wss.on('connection', (ws) => {
  console.log('Client connected');

  ws.send('🟢 Bạn đã kết nối tới WebSocket Server');

  ws.on('message', (message) => {
    console.log('Received:', message);

    // Broadcast cho tất cả client
    wss.clients.forEach(client => {
      if (client.readyState === WebSocket.OPEN) {
        client.send(`💬 ${message}`);
      }
    });
  });

  ws.on('close', () => {
    console.log('Client disconnected');
  });
});

server.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
