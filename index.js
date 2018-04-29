const express = require('express');
const app = express();
const Websocket = require('ws');
const { loggerStderr, loggerStdoutNl } = require(`${__dirname}/src/utilities`);
const spHandler = require(`${__dirname}/src/spHandler`);
const wsHandler = require(`${__dirname}/src/wsHandler`);


app.use(express.static('gui'));

app.get('/', function (req, res) {
    res.sendFile(`${__dirname}/gui/index.html`);
});

const server = app.listen(1337, () => {
    loggerStdoutNl(server.address());
});


const wss = new Websocket.Server({ server });

wss.on(
    'connection'
    , (ws) => ws.on('message', wsHandler.messageHandler)
);


SerialPort
    .list()
    .then((ports) => ports.map(spHandler.portHandler))
    .then((parsers) => parsers.forEach((parser) => {
        parser.on('data', spHandler.dataHandler);
        parser.on('error', loggerStderr);
    }))
    .catch(loggerStderr);
