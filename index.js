const express = require('express');
const socketIo = require('socket.io');
const SerialPort = require('serialport');
const { loggerStdoutNl } = require(`${__dirname}/src/utilities`);
const socketHandler = require(`${__dirname}/src/socketHandler`);
const spHandler = require(`${__dirname}/src/spHandler`);


const app = express();

app.use(express.static('gui'));

app.get('/', function (req, res) {
    res.sendFile(`${__dirname}/gui/index.html`);
});

const server = app.listen(1337, () => {
    loggerStdoutNl(server.address());
});


const io = socketIo(server);
let socH = socketHandler(io);

const bla = spHandler(socH);

