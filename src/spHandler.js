const SerialPort = require('serialport');
const { baudRate, delimiter } = require(`${process.cwd()}/config/config`);
const { loggerStdout, loggerStdoutNl } = require('./utilities');

/**
 * @param {object} port desc
 * @example
 * { comName: 'COM13',
 *   manufacturer: 'Silicon Labs',
 *   serialNumber: '00BCAC79',
 *   pnpId: 'USB\\VID_10C4&PID_EA60\\00BCAC79',
 *   locationId: 'Port_#0007.Hub_#0006',
 *   vendorId: '10C4',
 *   productId: 'EA60' }
 */
const portHandler = (port) => new SerialPort(port.comName, { baudRate })
    .pipe(new SerialPort.parsers.Readline({ delimiter }));

const dataHandler = (data) => loggerStdoutNl(data);

module.exports = {
    portHandler
    , dataHandler
}
