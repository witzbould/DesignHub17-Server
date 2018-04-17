let express = require('express');
let Websocket = require('ws');
let http = require('http');

const app = express();

//initialize a simple http server
const server = http.createServer(app);

//initialize the WebSocket server instance
const wss = new Websocket.Server({ server });

wss.on('connection', (ws) => {
    ws.on('message', (message) => {
        let answer = handleResponse(message);
        ws.send(answer);
    });

    //send immediate feedback to the incoming connection    
    ws.send(JSON.stringify('Connected to WebSocket!'));
});

function handleResponse(response) {
    let res = JSON.parse(response);
    switch (res.type) {
        case 'UPDATE_ANNOTATIONS':
            console.log('received: %s', JSON.stringify(res.payload));
            break;
        case 'PLAYPAUSE':
            console.log('PLAYPAUSE received');
        default:
            console.warn('Unkown Type', res);
    }
    return JSON.stringify(response)
}

//start our server
server.listen(3000, () => {
    console.log(`Server started on port ${server.address().port} :)`);
});