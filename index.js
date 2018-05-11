const express = require('express');
const socketIo = require('socket.io');
const SerialPort = require('serialport');
const { loggerStdoutNl } = require(`${__dirname}/src/utilities`);
const socketHandler = require(`${__dirname}/src/socketHandler`);
const spHandler = require(`${__dirname}/src/spHandler`);
const { debuglog, inspect } = require('util');


const app = express();

app.use(express.static('gui'));

app.get('/', function (req, res) {
    res.sendFile(`${__dirname}/gui/index.html`);
});

const server = app.listen(3000, () => {
    loggerStdoutNl(server.address());
});

const io = socketIo(server);

io.on('connect', (socket) => {
    socket.on('message', (message) => {
        socH.messageHandler(message);
        // testing
        // socket.broadcast.emit('message', JSON.stringify({
        //     action: 'BOBBLE_DIRECTION',
        //     payload: { 
        //         // x: Math.random()*100,
        //         // y: Math.random()*100,
        //         angle: Math.random()*360
        //     }
        // }));
    });

    socket.on('bobble', message => {
        socH.messageHandler(message);
        const msg = JSON.parse(message)
        if (msg.action === 'CHANGE_DIRECTION') {
            let angle = msg.payload.angle;
            angle += 112.5;
            io.emit('bobble', JSON.stringify({action: 'CHANGE_DIRECTION', payload: { angle: angle}}));
        }
        if (msg.action === 'PLAYPAUSE') {
            io.emit('bobble', JSON.stringify({action: 'PLAYPAUSE'}));
        }

        if (msg.action === 'SWITCH_EDGY') {
            io.emit('bobble', JSON.stringify({action: 'SWITCH_EDGY'}));
        }
        
    })

    socket.on('disconnect', loggerStdoutNl);
});
const socH = socketHandler(io);
const bla = spHandler(socH);

process.on('unhandledRejection', (reason, p) => {
    // application specific logging, throwing an error, or other logic here
    process.stderr.write(`Unhandled Rejection at: Promise ${inspect(p)}\nreason: ${inspect(reason)}`)
})
