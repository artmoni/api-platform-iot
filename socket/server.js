const io = require('socket.io')();
var SerialPort = require('serialport');
var xbee_api = require('xbee-api');
var C = xbee_api.constants;
var remotePad = require('./remotePad');
const { addPlayer, getListGame, addGame } = require('./requestRemote');
process.env["NODE_TLS_REJECT_UNAUTHORIZED"] = 0;


var xbeeAPI = new xbee_api.XBeeAPI({
  api_mode: 2
});


let serialport = new SerialPort("/dev/tty.SLAB_USBtoUART", {
  baudRate: 9600,
}, function (err) {
  if (err) {
    return console.log('Error: ', err.message)
  }
});

serialport.pipe(xbeeAPI.parser);
xbeeAPI.builder.pipe(serialport);

serialport.on("open", function () {
  var frame_obj = { // AT Request to be sent
    type: C.FRAME_TYPE.AT_COMMAND,
    command: "NI",
    commandParameter: [],
  };

  xbeeAPI.builder.write(frame_obj);

  frame_obj = { // AT Request to be sent
    type: C.FRAME_TYPE.REMOTE_AT_COMMAND_REQUEST,
    destination64: "FFFFFFFFFFFFFFFF",
    command: "NI",
    commandParameter: [],
  };
  xbeeAPI.builder.write(frame_obj);

});

// All frames parsed by the XBee will be emitted here

xbeeAPI.parser.on("data", function (frame) {

  //on new device is joined, register it

  //on packet received, dispatch event
  //let dataReceived = String.fromCharCode.apply(null, frame.data);
  if (C.FRAME_TYPE.ZIGBEE_RECEIVE_PACKET === frame.type) {
    console.log("C.FRAME_TYPE.ZIGBEE_RECEIVE_PACKET");
    let dataReceived = String.fromCharCode.apply(null, frame.data);
    console.log(">> ZIGBEE_RECEIVE_PACKET >", dataReceived);

    browserClient && browserClient.emit('pad-event', {
      device: frame.remote64,
      data: dataReceived
    });
  }

  if (C.FRAME_TYPE.NODE_IDENTIFICATION === frame.type) {
     let dataReceived = String.fromCharCode.apply(null, frame.nodeIdentifier);
    console.log(">> NODE_IDENTIFICATION >", frame);


  } else if (C.FRAME_TYPE.ZIGBEE_IO_DATA_SAMPLE_RX === frame.type) {
console.log(">> ZIGBEE_IO_DATA_SAMPLE_RX FRAME>", frame);


remotePad.macAddress = frame.remote64;

remotePad.btn1 = frame.digitalSamples[C.DIGITAL_CHANNELS.MASK[1][0]];
remotePad.btn2 = frame.digitalSamples[C.DIGITAL_CHANNELS.MASK[2][0]];
remotePad.btn3 = frame.digitalSamples[C.DIGITAL_CHANNELS.MASK[3][0]];

console.log(remotePad);

  } else if (C.FRAME_TYPE.REMOTE_COMMAND_RESPONSE === frame.type) {
    let dataReceived = String.fromCharCode.apply(null, frame.commandData);
    console.log(">> REMOTE_COMMAND_RESPONSE >", dataReceived);

  } else {
    console.debug("FRAME :", frame);
    let dataReceived = String.fromCharCode.apply(null, frame.commandData);
    console.log(">> dataReceived >",  dataReceived);

    //console.log(getListGame());
    //console.log(addPlayer());
    console.log(addGame());
  }

});
let browserClient;
io.on('connection', (client) => {
  console.log(client.client.id);
  browserClient = client;

  client.on('subscribeToPad', (interval) => {
    console.log('client is subscribing to timer with interval ', interval);
    // setInterval(() => {
    //   client.emit('pad-event', {
    //     device: "test device",
    //     data: Math.round(Math.random()) * 2 - 1
    //   })
    //   ;
    // }, Math.random() * 1000);
  });

  client.on("disconnect", () => {
    console.log("Client disconnected");
  });
});

const port = 8000;
io.listen(port);
console.log('listening on port ', port);
//
// serial_xbee.on("data", function(data) {
//     console.log(data.type);
//   // console.log('xbee data received:', data.type);
//   // client.emit('timer', "pouet");
// //
// });

// shepherd.on('ready', function () {
//   console.log('Server is ready.');
//
//   // allow devices to join the network within 60 secs
//   shepherd.permitJoin(60, function (err) {
//     if (err)
//       console.log(err);
//   });
// });
//
// shepherd.start(function (err) {                // start the server
//   if (err)
//     console.log(err);
// });
