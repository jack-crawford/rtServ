const { Server } = require('ws');
const express = require('express')
const PORT = process.env.PORT || 3000;
const INDEX = '/index.html';

const server = express()
  .use((req, res) => res.sendFile(INDEX, { root: __dirname }))
  .listen(PORT, () => console.log(`Listening on ${PORT}`));

const wss = new Server({ server });

wss.on('connection', function(ws) {
  console.log("test")
  ws.on('message', function(message) {
    // Broadcast any received message to all clients
    console.log('received: %s', message);
    wss.broadcast(message);
  });
});

wss.broadcast = function(data) {
  this.clients.forEach(function(client) {
    console.log(client.readyState)
    if(client.readyState == 1) {
      client.send(data);
    }
  });
};

console.log('Server running. Visit https://localhost:' +  (PORT) + ' in Firefox/Chrome.\n\n');
