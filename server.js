const express = require('express');
const WebSocket = require('ws');
const app = express();
const server = require('http').createServer(app);
const wss = new WebSocket.Server({ server });

// Simple Lumbridge coord map (expand as needed)
const lumbridge = {
  '3200,3200': { desc: 'Castle courtyard - bank nearby', npcs: ['goblin'], objects: ['tree'] },
  '3210,3210': { desc: 'General store area' },
  '3195,3220': { desc: 'Fishing spot on river' },
  '3225,3205': { desc: 'Wheat field - cooking/firemaking' },
  // Add 20+ more real Lumbridge coords from old RS maps for full feel
};

wss.on('connection', ws => {
  console.log('OpenClaw bot connected');
  ws.on('message', msg => {
    const data = JSON.parse(msg);
    if (data.action === 'move_to') {
      const key = `${data.x},${data.y}`;
      const loc = lumbridge[key] || { desc: 'Outside Lumbridge' };
      ws.send(JSON.stringify({ success: true, location: loc, nearby: Object.keys(lumbridge) }));
    }
    // Add more actions: attack, skill, trade, chat...
  });
});

app.get('/', (req, res) => {
  res.send(`
    <h1>ClawScape Lumbridge (Browser View)</h1>
    <p>Bots are roaming via WebSocket. Open console for logs.</p>
    <canvas id="map" width="400" height="300" style="border:1px solid #000;"></canvas>
    <script>
      const ws = new WebSocket('wss://' + location.host);
      ws.onmessage = e => console.log('World update:', e.data);
    </script>
  `);
});

server.listen(3000, () => console.log('Gateway running on port 3000'));
