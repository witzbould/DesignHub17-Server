const express = require('express');
const app = express();
const Websocket = require('ws');
// const http = require('http');
const {
    debugLoggerStderr
    , loggerStderr
    , loggerStderrNl
    , loggerStdout
    , loggerStdoutNl
} = require('./src/utilities');

// baudrate: 57600



//initialize a simple http server
// const server = http.createServer(app);


app.use(express.static('gui'));

app.get('/', function (req, res) {
    res.sendFile(`${__dirname}/public/index.html`);
});

const server = app.listen(1337, () => {
    loggerStdoutNl(server.address());
});




//initialize the WebSocket server instance
const wss = new Websocket.Server({ server });

wss.on('connection', (ws) => {
    ws.on('message', (message) => {
        let answer = handleResponse(message);
        ws.send(answer);
    });
});

function handleResponse(response) {
    let res = JSON.parse(response);
    switch (res.type) {
        case 'UPDATE_ANNOTATIONS':
            loggerStdout('received: %s');
            loggerStdoutNl(JSON.stringify(res.payload));
            break;
        case 'PLAYPAUSE':
            loggerStdoutNl('PLAYPAUSE received');
            break;
        default:
            loggerStdout('Unkown Type: ');
            loggerStdoutNl(res);
    }

    return JSON.stringify(response);
}
