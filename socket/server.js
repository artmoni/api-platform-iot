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
});

client.on('message',(topic,message) => {
  switch (topic) {
    case 'PlayerOne':
      console.log(`TopicResponse: ${message.toString()}`);
    break;
    case 'PlayerTwo':
      console.log(`TopicResponse: ${message.toString()}`);
    break;
    default:
      break;
  }
});

xbeeAPI.parser.on("data", function (frame) {

  if(C.FRAME_TYPE.NODE_IDENTIFICATION === frame.type){
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
        default:
          console.log(`xbee NI is not valide : ${frame.nodeIdentifier} \n PlayerOne or PlayerTwo awaited`);
        break;
      }
    }

    if (C.FRAME_TYPE.ZIGBEE_IO_DATA_SAMPLE_RX === frame.type) {
      // Vérifie si le bouton D0 a été pressé.
      const buttonD0Pressed = frame.digitalSamples.D0 === 1;
      if (buttonD0Pressed) {
        console.log("Button D0 was pressed.");
        // Ajoutez la logique ici lorsque le bouton D0 est pressé.
      }

      // Vérifie si le bouton D1 a été pressé.
      const buttonD1Pressed = frame.digitalSamples.D1 === 1;
      if (buttonD1Pressed) {
        console.log("Button D1 was pressed.");
        // Ajoutez la logique ici lorsque le bouton D1 est pressé.
      }
  }
  
  
});

xbeeAPI.parser.on("data", function (frame) {
  if (C.FRAME_TYPE.ZIGBEE_IO_DATA_SAMPLE_RX === frame.type) {
    const sourceAddress = frame.remote64; //Permet de savoir quelles XBee a envoyé l'information
    console.log("Received packet from XBee with address " + sourceAddress);
    // reste du code de manipulation de paquets ici ...
  }
});
