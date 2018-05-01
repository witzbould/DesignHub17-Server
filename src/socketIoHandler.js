const {
    loggerStdout
    , loggerStdoutNl
    , jsonParse
} = require('./utilities');

const messageHandler = (message) => {
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
        default:
            loggerStdout('Unkown Type: ');
            loggerStdoutNl(msg);
    }
}

module.exports = {
    messageHandler
}
