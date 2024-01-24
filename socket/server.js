var SerialPort = require("serialport");
var xbee_api = require("xbee-api");
var C = xbee_api.constants;
//var storage = require("./storage")
require("dotenv").config();

const SERIAL_PORT = process.env.SERIAL_PORT;

var xbeeAPI = new xbee_api.XBeeAPI({
  api_mode: 2,
});

let serialport = new SerialPort(
  SERIAL_PORT,
  {
    baudRate: parseInt(process.env.SERIAL_BAUDRATE) || 9600,
  },
  function (err) {
    if (err) {
      return console.log("Error: ", err.message);
    }
  }
);

serialport.pipe(xbeeAPI.parser);
xbeeAPI.builder.pipe(serialport);

serialport.on("open", function () {
  var frame_obj = {
    // AT Request to be sent
    type: C.FRAME_TYPE.AT_COMMAND,
    command: "NI",
    commandParameter: [],
  };

  xbeeAPI.builder.write(frame_obj);

  frame_obj = {
    // AT Request to be sent
    type: C.FRAME_TYPE.REMOTE_AT_COMMAND_REQUEST,
    destination64: "FFFFFFFFFFFFFFFF",
    command: "NI",
    commandParameter: [],
  };
});

// All frames parsed by the XBee will be emitted here

// storage.listSensors().then((sensors) => sensors.forEach((sensor) => console.log(sensor.data())))
xbeeAPI.parser.on("data", function (frame) {
  //on new device is joined, register it
  if (frame.digitalSamples) {
    if (frame.digitalSamples.DIO0 === 1) {
      var frame_obj = {
        // AT Request to be sent
        type: C.FRAME_TYPE.REMOTE_AT_COMMAND_REQUEST,
        destination64: "0013a20041fb76ea",
        command: "D1",
        commandParameter: [0x05],
      };
      xbeeAPI.builder.write(frame_obj);
    } else {
      var frame_obj = {
        // AT Request to be sent
        type: C.FRAME_TYPE.REMOTE_AT_COMMAND_REQUEST,
        destination64: "0013a20041fb76ea",
        command: "D1",
        commandParameter: [0x04],
      };
      xbeeAPI.builder.write(frame_obj);
    }
  }
});
