const express = require('express');
const app = express();
const socketIo = require('socket.io');
const SerialPort = require('serialport');
const { loggerStderr, loggerStdoutNl } = require(`${__dirname}/src/utilities`);
const socketIoHandler = require(`${__dirname}/src/socketIoHandler`);
const spHandler = require(`${__dirname}/src/spHandler`);


app.use(express.static('gui'));

app.get('/', function (req, res) {
    res.sendFile(`${__dirname}/gui/index.html`);
});

const server = app.listen(1337, () => {
    loggerStdoutNl(server.address());
});


const io = socketIo(server);

io.on('connect', (socket) => {
    socket.on('message', (message) => {
        socketIoHandler.handleMessage(message);
    });

    socket.on('disconnect', loggerStdoutNl('Client disconnected'));
});


SerialPort
    .list()
    .then((ports) => ports.map(spHandler.portHandler))
    .then((parsers) => parsers.forEach((parser) => {
        parser.on('data', spHandler.dataHandler);
        parser.on('error', loggerStderr);
    }))
    .catch(loggerStderr);
