var SerialPort = require('serialport');
var xbee_api = require('xbee-api');
var C = xbee_api.constants;
const mqtt = require('mqtt');
const client = mqtt.connect('mqtt://test.mosquitto.org');
client.username = 'admin';
client.password = 'hivemq';
//var storage = require("./storage")
require('dotenv').config()

client.on('connect', () => {
  console.log('Connecté au broker MQTT');
});

client.on('error', (error) => {
  console.error('Erreur de connexion MQTT :', error);
});

const SERIAL_PORT = process.env.SERIAL_PORT;

var xbeeAPI = new xbee_api.XBeeAPI({
  api_mode: 2
});

let serialport = new SerialPort(SERIAL_PORT, {
  baudRate: parseInt(process.env.SERIAL_BAUDRATE) || 9600,
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

client.on('connect', () => {
  client.subscribe('PlayerOne');
  client.subscribe('PlayerTwo');
  client.subscribe('YesButton');
  client.subscribe('NoButton');
  client.subscribe('Complatible');
  client.subscribe('NotComplatible');
});

client.on('message', (topic, message) => {
  switch (topic) {
    case 'PlayerOne':
      console.log(`TopicResponse: ${message.toString()}`);
      break;
    case 'PlayerTwo':
      console.log(`TopicResponse: ${message.toString()}`);
      break;
    case 'YesButton':
      console.log(`YesButton: ${message.toString()}`);
      break;
    case 'NoButton':
      console.log(`NoButton: ${message.toString()}`);
      break;
    case 'Complatible':
      frame_obj = { // AT Request to be sent
        type: C.FRAME_TYPE.REMOTE_AT_COMMAND_REQUEST,
        destination64: "FFFFFFFFFFFFFFFF",
        command: "D3",
        commandParameter: [0x05],
      };
      xbeeAPI.builder.write(frame_obj);
      break;
    case 'NotComplatible':
      frame_obj = { // AT Request to be sent
        type: C.FRAME_TYPE.REMOTE_AT_COMMAND_REQUEST,
        destination64: "FFFFFFFFFFFFFFFF",
        command: "D3",
        commandParameter: [0x04],
      };
      xbeeAPI.builder.write(frame_obj);
      break;
    default:
      break;
  }
});

xbeeAPI.parser.on("data", function (frame) {

  //console.log(frame);
  if (C.FRAME_TYPE.NODE_IDENTIFICATION === frame.type) {
    console.log(frame);
    // Vérification des messages déjà publiés sur le topic "PlayerOne"
    switch (frame.nodeIdentifier) {
      case 'PlayerOne':
        client.publish('PlayerOne', JSON.stringify(frame));
        console.log(`PlayerOne Topic = ${JSON.stringify(frame)}`);
        break;
      case 'PlayerTwo':
        client.publish('PlayerTwo', JSON.stringify(frame));
        console.log(`PlayerTwo Topic = ${JSON.stringify(frame)}`);
        break;
      case 'Validator':
        client.publish('NotCompatible', JSON.stringify(frame));
        console.log('Led reset');
        break;
      default:
        console.log(`xbee NI is not valide : ${frame.nodeIdentifier} \n PlayerOne or PlayerTwo awaited`);
        break;
    }
  }

  if (C.FRAME_TYPE.ZIGBEE_IO_DATA_SAMPLE_RX === frame.type) {

    const buttonD0Pressed = frame.digitalSamples.DIO0 === 1;
    if (buttonD0Pressed) {
      client.publish('YesButton', JSON.stringify(frame));
      client.publish('Validation', JSON.stringify(frame));
      console.log('YesButton publish');
    }

    const buttonD1Pressed = frame.digitalSamples.DIO1 === 1;
    if (buttonD1Pressed) {
      client.publish('NoButton', JSON.stringify(frame));
      console.log('NoButton publish');
    }
  }
});
