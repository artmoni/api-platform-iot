var SerialPort = require('serialport');
var xbee_api = require('xbee-api');
var firestore = require('firebase/firestore');
var firebaseNIChange = require('./firebaseInit');
var C = xbee_api.constants;
var storage = require("./storage")
require('dotenv').config()

const SERIAL_PORT = process.env.SERIAL_PORT;
const SERIAL_BAUDRATE = parseInt(process.env.SERIAL_BAUDRATE);

const HEX_VALUE_DOUT_LOW = [0x04];
const HEX_VALUE_DOUT_HIGH = [0x05];

firestore.onSnapshot(firestore.collection(firebaseNIChange.db, 'caisse'), (snapshot) => {
  snapshot.docChanges().forEach((change) => {
    if (change.type === "modified" && change.doc.id.length==16) {
      setOrGetNI(change.doc.id, change.doc.data().numero);
    }
  });
});

var xbeeAPI = new xbee_api.XBeeAPI({
  api_mode: 2
});

let serialport = new SerialPort(SERIAL_PORT, {
  baudRate: SERIAL_BAUDRATE || 9600,
}, function (err) {
  if (err) {
    return console.log('Error: ', err.message)
  }
});

serialport.pipe(xbeeAPI.parser);
xbeeAPI.builder.pipe(serialport);

serialport.on("open", function () {
  var frame_obj = { // AT Request to be sent
    type: C.FRAME_TYPE.REMOTE_AT_COMMAND_REQUEST,
    destination64: "0013A20041C34AFB",
    command: "NI",
    commandParameter: "",
  };
  console.log("DEBUT: "+frame_obj.command)
  console.log("DEBUT: "+frame_obj.destination64);
  xbeeAPI.builder.write(frame_obj);
});

// storage.listSensors().then((sensors) => sensors.forEach((sensor) => console.log(sensor.data())))

xbeeAPI.parser.on("data", function (frame) {
  if (C.FRAME_TYPE.ZIGBEE_RECEIVE_PACKET === frame.type) {
    let dataReceived = String.fromCharCode.apply(null, frame.data);
    console.log("ZIGBEE_RECEIVE_PACKET >", dataReceived +" cm from "+frame.remote64);

    if(dataReceived == -1){
      handleLED(frame.remote64, HEX_VALUE_DOUT_LOW);
      storage.isUnavailable(frame.remote64, true);
    }else{
      handleLED(frame.remote64, HEX_VALUE_DOUT_HIGH);
      storage.isUnavailable(frame.remote64, false);
    }

  }else if (C.FRAME_TYPE.NODE_IDENTIFICATION === frame.type) {
    console.log("NODE_IDENTIFICATION");
    console.log("OLD NI: "+frame.nodeIdentifier+" ; Addr MAC: "+frame.remote64);

    var newNI ="";
    
    storage.listCaisse().then((data) => {
        newNI = "A"+(data.size+1);
        setOrGetNI(frame.remote64, newNI);
        // console.log("NEW NI: "+newNI);
        storage.registerMachine(frame.remote64, newNI);
    });

  }else if (C.FRAME_TYPE.ZIGBEE_IO_DATA_SAMPLE_RX === frame.type) {
    console.log("ZIGBEE_IO_DATA_SAMPLE_RX")
    // console.log(frame.analogSamples.AD0)
    // storage.registerSample(frame.remote64,frame.analogSamples.AD0 )

  }else if (C.FRAME_TYPE.REMOTE_COMMAND_RESPONSE === frame.type) {
    if(frame.command=="D0"){ 
      console.log("REMOTE_COMMAND_RESPONSE > LED ACTION ON: "+frame.remote64);
    }
    // Convertir buffer reçu en hexa vers ASCII
    console.log(String.fromCharCode.apply(null, frame.commandData));

  } else {
    console.debug("ELSE FRAME: "+frame.type);
    console.debug("ELSE FRAME: "+frame.remote64);
    console.debug("ELSE FRAME: "+frame.command);
    console.debug("ELSE FRAME: "+frame.commandParameter);
    let dataReceived = String.fromCharCode.apply(null, frame.data)
    console.log(dataReceived);
  }
});

function handleLED(remote64, commParam){
  // console.log(remote64 + typeof(remote64))
  // console.log(commParam + typeof(commParam));
    var frame_obj = { // AT Request to be sent
      type: C.FRAME_TYPE.REMOTE_AT_COMMAND_REQUEST,
      destination64: remote64,
      command: "D0",
      remoteCommandOptions: 0x02,
      commandParameter: commParam,
    };
    // console.log(remote64);
    // console.log(frame_obj.commandParameter);
    xbeeAPI.builder.write(frame_obj);
}

function setOrGetNI(remote64, newNI=""){
  var frame_obj = { // AT Request to be sent
    type: C.FRAME_TYPE.REMOTE_AT_COMMAND_REQUEST,
    destination64: remote64,
    command: "NI",
    commandParameter: newNI,
  };
  console.log("setOrGetNI() > "+remote64+" NI: "+newNI);
  xbeeAPI.builder.write(frame_obj);
}