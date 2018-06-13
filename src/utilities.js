const { EOL } = require('os');
const { debuglog, inspect } = require('util');
const debugLogger = debuglog('debug');

/**
 * Log messages to stderr, if NODE_DEBUG=debug
 * @param	{any}	data any data will be parsed with util.inspect
 * @returns	{any}	identity function
 */
const debugLoggerStderr = (data) => {
    debugLogger(inspect(data));

    return data;
};

/**
 * Log messages to stderr
 * @param	{any}	data any data will be parsed with util.inspect
 * @param   {boolean} eol end of line
 * @returns	{any}	identity function
 */
const loggerStderr = (data, eol) => {
    process.stderr.write(inspect(data));
    if (eol === true)
        process.stderr.write(EOL);

    return data;
};

const loggerStderrNl = (data) => loggerStderr(data, true);

/**
 * Log messages to stdout
 * @param	{any}	data any data will be parsed with util.inspect
 * @param   {boolean} eol end of line
 * @returns	{any}	identity function
 */
const loggerStdout = (data, eol) => {
    process.stdout.write(inspect(data));
    if (eol === true)
        process.stdout.write(EOL);

    return data;
};

const loggerStdoutNl = (data) => loggerStdout(data, true);


const jsonParse = (data) => {
    let ret;

    try {
        ret = JSON.parse(data);
    }
    /**
     * @param {SyntaxError} error json parse throws SyntaxError
     */
    catch (error) {
        ret = {
            type: error.name
            , payload: error.message
        };
    }

    return ret;
};

module.exports = {
    debugLoggerStderr
    , loggerStderr
    , loggerStderrNl
    , loggerStdout
    , loggerStdoutNl
    , jsonParse
};
