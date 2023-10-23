const express = require('express');
const expressWs = require('express-ws');
const app = express();
const expressWsInstance = expressWs(app);

// Store connected clients
const clients = new Set();

// Serve the HTML and WebSocket endpoint
app.get('/', (req, res) => {
  res.sendFile(__dirname + '/index.html');
});

app.ws('/', (ws, req) => {
  clients.add(ws);

  ws.on('message', (message) => {
    // Broadcast messages to all connected clients
    clients.forEach((client) => {
      if (client !== ws && client.readyState === ws.OPEN) {
        client.send(message);
      }
    });
  });

  ws.on('close', () => {
    clients.delete(ws);
  });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
