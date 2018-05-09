const {
    loggerStdout
    , loggerStdoutNl
    , loggerStderrNl
    , jsonParse
} = require('./utilities');


function socketHandler(socketIo) {
    this.spHandler = null;

    const that = this;

    socketIo.on('connect', (socket) => {
        socket.on('message', (message) => { // that.messageHandler.bind(that)
            that.messageHandler(message).bind(that);

            socket.broadcast.emit('message', JSON.stringify({
                action: 'BOBBLE_DIRECTION',
                payload: {
                    x: Math.random() * 100,
                    y: Math.random() * 100
                }
            }));
        });

        socket.on('disconnect', loggerStdoutNl);
     });
}

socketHandler.prototype.messageHandler = function (message) {
    const msg = jsonParse(message);

    switch (msg.type) {
        case 'UPDATE_ANNOTATIONS':
            loggerStdout('received: %s');
            loggerStdoutNl(JSON.stringify(msg.payload));
            break;
        case 'PLAYPAUSE':
            loggerStdoutNl('PLAYPAUSE received');
            break;
        case 'PLAY':
            loggerStdoutNl('PLAY received');
            break;
        case 'PAUSE':
            loggerStdoutNl('PAUSE received');
            break;
        case 'VIBRATION':
            this.sendToSerialPort('beltPort', msg.payload);
            break;
        case 'SyntaxError':
            loggerStderrNl(`SyntaxError: ${msg}`);
            break;
        default:
            loggerStdout('Unkown Type: ');
            loggerStdoutNl(msg);
    }
}

socketHandler.prototype.sendToSerialPort = function (port, msg) {
    if (!this.spHandler) {
        loggerStderrNl('No SerialPort handler available.');
        return;
    }

    this.spHandler.emit(port, msg);
}


module.exports = (socketIo) => new socketHandler(socketIo);
