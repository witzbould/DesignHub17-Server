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
        default:
            loggerStdout('Unkown Type: ');
            loggerStdoutNl(msg);
    }
}

module.exports = {
    messageHandler
}
