const express = require('express');
const app = express();
const Websocket = require('ws');
const { loggerStdoutNl } = require('./src/utilities');
const wsHandler = require('./src/wsHandler');

// baudrate: 57600


app.use(express.static('gui'));

app.get('/', function (req, res) {
    res.sendFile(`${__dirname}/public/index.html`);
});

const server = app.listen(1337, () => {
    loggerStdoutNl(server.address());
});


const wss = new Websocket.Server({ server });

wss.on(
    'connection'
    , (ws) => ws.on('message', wsHandler.messageHandler)
);
