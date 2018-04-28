let express = require('express');
let Websocket = require('ws');
let http = require('http');
let socketIo = require('socket.io');

const app = express();

//initialize a simple http server
const server = http.createServer(app);

const io = socketIo(server);

io.on('connect', (socket) => {
    console.log(`Connected client on port ${server.address().port}`);
    socket.on('message', (m) => {
        handleResponse(m);
        // io.emit('message', m);
    });

    socket.on('disconnect', () => {
        console.log('Client disconnected');
    });
});


function handleResponse(response) {
    let res = JSON.parse(response);
    switch (res.type) {
        case 'UPDATE_ANNOTATIONS':
            console.log('received: %s', JSON.stringify(res.payload));
            break;
        case 'PLAYPAUSE':
            console.log('PLAYPAUSE received');
            break;
        case 'PLAY':
            console.log('PLAY received');
            break;
        case 'PAUSE':
            console.log('PAUSE received');
            break;
        default:
            console.warn('Unkown Type', res);
    }
    // return JSON.stringify(response)
}

//start our server
server.listen(3000, () => {
    console.log(`Server started on port ${server.address().port} :)`);
});