var SerialPort = require('serialport');
var xbee_api = require('xbee-api');
var C = xbee_api.constants;
require('dotenv').config();

// Import MQTT module
const mqtt = require('mqtt');

// Load environment variables
const SERIAL_PORT = process.env.SERIAL_PORT;
const MQTT_BROKER_URL = process.env.MQTT_BROKER_URL || 'mqtt://test.mosquitto.org';
const MQTT_TOPICS = {
  frontSensor: 'topic/proximitySensor',
  backSensor: 'topic/backSensor',
  camera: 'topic/camera',
};

// Initialize XBee API
var xbeeAPI = new xbee_api.XBeeAPI({
  api_mode: 2
});

// Initialize Serial Port
let serialport = new SerialPort(SERIAL_PORT, {
  baudRate: parseInt(process.env.SERIAL_BAUDRATE) || 9600,
}, function (err) {
  if (err) {
    return console.log('Error: ', err.message);
  }
});

serialport.pipe(xbeeAPI.parser);
xbeeAPI.builder.pipe(serialport);

// Initialize MQTT client
const client = mqtt.connect(MQTT_BROKER_URL);

client.on('connect', () => {
  console.log('Connected to MQTT broker');
  Object.values(MQTT_TOPICS).forEach(topic => {
    client.subscribe(topic, (err) => {
      if (!err) {
        console.log(`Successfully subscribed to ${topic}`);
      } else {
        console.error(`Subscription error for ${topic}:`, err);
      }
    });
  });
});

client.on('message', (topic, message) => {
  console.log(`Message received on ${topic}: ${message.toString()}`);

  if (topic === MQTT_TOPICS.frontSensor && message.toString() === "on") {
    var frame_obj = {
      type: C.FRAME_TYPE.ZIGBEE_TRANSMIT_REQUEST,
      destination64: '0013A20041582EF0',
      data: "cameraOn",
    };
    xbeeAPI.builder.write(frame_obj);
  }

  if (topic === MQTT_TOPICS.backSensor) {
    var frame_obj = {
      type: C.FRAME_TYPE.ZIGBEE_TRANSMIT_REQUEST,
      destination64: '0013A20041582EF0',
      data: "cameraOn",
    };
    xbeeAPI.builder.write(frame_obj);
  }

  if (topic === MQTT_TOPICS.camera && message.toString() === "on") {
    var frame_obj = {
      type: C.FRAME_TYPE.ZIGBEE_TRANSMIT_REQUEST,
      destination64: '0013A20041582EF0',
      data: "cameraOn",
    };
    xbeeAPI.builder.write(frame_obj);
  }

});

serialport.on('open', function () {
  console.log('Serial port open');
  var frame_obj = {
    type: C.FRAME_TYPE.ZIGBEE_TRANSMIT_REQUEST,
    destination64: '0013A20041582EF0',
    data: 'led2 \n',
  };
  xbeeAPI.builder.write(frame_obj);
});

xbeeAPI.parser.on('data', function (frame) {
  if (C.FRAME_TYPE.ZIGBEE_RECEIVE_PACKET === frame.type) {
    console.log('C.FRAME_TYPE.ZIGBEE_RECEIVE_PACKET');
    let dataReceived = String.fromCharCode.apply(null, frame.data);
    console.log('>> capteurs >', dataReceived);
    try {
      var res = JSON.parse(dataReceived);
      console.log(res);

      if (res.capteurProxi) {
        client.publish(MQTT_TOPICS.frontSensor, "true");
        console.log(`Published capteurProxi to ${MQTT_TOPICS.frontSensor}: true`);
      }
      if (res.capteurChoc) {
        client.publish(MQTT_TOPICS.backSensor, "true");
        console.log(`Published capteurChoc to ${MQTT_TOPICS.backSensor}: true`);
      }
      if (res.cameraOff) {
        client.publish(MQTT_TOPICS.camera, "true");
        console.log(`Published cameraOff to ${MQTT_TOPICS.camera}: true`);
      }
    } catch (e) {
      console.log('Error parsing JSON:', e);
    }
  }
});
