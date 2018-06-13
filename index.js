const express = require('express');
const socketIo = require('socket.io');
const { loggerStdoutNl } = require(`${__dirname}/src/utilities`);
const socketHandler = require(`${__dirname}/src/socketHandler`);
const spHandler = require(`${__dirname}/src/spHandler`);
const { inspect } = require('util');


const app = express();

app.use(express.static('gui'));
app.use(express.static('bobble'));

app.get('/', function (req, res) {
    res.sendFile(`${__dirname}/gui/index.html`);
});

app.get('/bobble', function (req, res) {
    res.sendFile(`${__dirname}/bobble/index.html`);
});

const server = app.listen(3000, () => {
    loggerStdoutNl(server.address());
});

spHandler(socketHandler(socketIo(server)));

process.on('unhandledRejection', (reason, promise) => {
    // application specific logging, throwing an error, or other logic here
    process.stderr.write(`Unhandled Rejection at: Promise ${inspect(promise)}\nreason: ${inspect(reason)}`);
});
