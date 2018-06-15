# DesignHub17Server
Server application for DesignHub17, controles tactile hardware and serves UI

## Getting Started

This Project needs Nodejs (latest would be nice, but stabel is also ok).
This Project contains the control-ui as git submodules.
To set it up do the following:

```
$ git clone {{this repo}}
$ git submodule init
$ git submodule update
$ npm i
```

This will install the DesignHub17Server and clones its submodules ready to be used.

## Configure Tactile Hardware

Connect the belt and bracelet to the computer running the server via usb.
Start the server with `npm start`.
Now ist should spinn up an express server and print the home ip-address with the port number.
Next it prints the found serial port configurations special to the running system.

```
/**
 * @param {object} port detected port configuration
 * @example
 * { comName: 'COM13',
 *   manufacturer: 'Silicon Labs',
 *   serialNumber: '00BCAC79',
 *   pnpId: 'USB\\VID_10C4&PID_EA60\\00BCAC79',
 *   locationId: 'Port_#0007.Hub_#0006',
 *   vendorId: '10C4',
 *   productId: 'EA60' }
 */
 ```
 
 You MUST set the serialNumber in the server's config file for the bracelet and the belt.
 This is special for every pc and usb setup.
 
 ```
 // ./config/config.js
 module.exports = {
    baudRate: 57600
    , delimiter: '\r\n'
    , bracelet: { serialNumber: '5&763bb00&0&2' } // change this number
    , belt: { serialNumber: '5&763bb00&0&1' } // and this
};
```

Now restart the server (like ctrl+c and npm start) and navigate to the servers ip address with port number in you browser.\
On a local host this looks like `[::1]:3000` or `127.0.0.1:3000` for the control ui.\
The beamer visualization url is `[::1]:3000/bobble` or `127.0.0.1:3000/bobble`.

Now press some buttons to see if it works :)
