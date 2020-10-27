const { Server } = require('ws');
const express = require('express');

const http = require('http');
const { client } = require('websocket');
const server = require('websocket').server;
const PORT = process.env.PORT || 3000;
const INDEX = '/index.html';

// const server = express()
//   .use((req, res) => res.sendFile(INDEX, { root: __dirname }))
//   .listen(PORT, () => console.log(`Listening on ${PORT}`));

// const wss = new Server({ server });

const httpServer = http.createServer(() => { });
httpServer.listen(PORT, () => {
  console.log('Server listening at port ' + (PORT));
});
const wsServer = new server({
  httpServer,
});
let clients = [];

wsServer.on('request', request => {
  const connection = request.accept();
  const id = Math.floor(Math.random() * 100);
  console.log("received request")
  clients.forEach(client => client.connection.send(JSON.stringify({
    client: id,
    text: 'I am now connected',
  })));


  clients.push({ connection, id });
  
  connection.send("hello there")

  connection.on('message', function(message) {
    console.log("Received: '" + message.utf8Data + "'");

    var js = JSON.parse(message.utf8Data);
    console.log(js)
    clients.forEach(el => {
      if(el.connection == connection){
        el.id = js.uuid;
      } else {
        if (js.sdp){
          el.connection.send(JSON.stringify({
            sdp: js.sdp,
            text: 'have an sdp!',
            uuid: js.uuid,
          }))
        }
        if(js.ice){
          el.connection.send(JSON.stringify({
            ice: js.ice,
            text: 'have an ice!',
            uuid: js.uuid,
          }))
        }
      }
    })
  });

});

console.log('Server running. Visit https://localhost:' +  (PORT) + ' in Firefox/Chrome.\n\n');

