var SerialPort = require("serialport");
var xbee_api = require("xbee-api");
var C = xbee_api.constants;
//var storage = require("./storage")
require("dotenv").config();
const mqtt = require("mqtt");
const client = mqtt.connect("mqtt://mqtt-dashboard.com");

client.on("connect", function () {
  client.subscribe("IOT/CTF/players");
  client.subscribe("IOT/CTF/flags");
});

const SERIAL_PORT = process.env.SERIAL_PORT;

var xbeeAPI = new xbee_api.XBeeAPI({
  api_mode: 2,
});
class XbeeDevice {
  constructor(id, isCapture, name, team, points) {
    this.id = id;
    this.name = name;
    this.team = team;
    this.isCapture = isCapture;
    this.points = points;
  }
}

class Flag {
  constructor(id, team, name, status, player = null) {
    this.id = id;
    this.team = team;
    this.name = name;
    this.status = status;
    this.player = player;
  }
}

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
    type: C.FRAME_TYPE.NODE_IDENTIFICATION,
    destination64: "FFFFFFFFFFFFFFFF",
    command: "NI",
    commandParameter: [],
  };
  const numPlayers = 1; // Remplacez par le nombre de joueurs souhaité
  const numFlags = 2; // Remplacez par le nombre de drapeaux souhaité

  for (let i = 0; i < numPlayers; i++) {
    const team = getRandomTeam() === 0 ? "Rouge" : "Bleu";
    const playerName = `Player${i + 1}`;
    const player = new XbeeDevice(playerName, `Player ${i + 1}`, team);

    // players.push(player);
  }

  for (let i = 0; i < numFlags; i++) {
    const team = getRandomTeam() === 0 ? "Rouge" : "Bleu";
    const flagName = `Flag${i + 1}`;
    const flag = new Flag(flagName, team, `Flag ${i + 1}`, "Free", null);

    // flags.push(flag);
  }
});

function getRandomTeam() {
  return Math.floor(Math.random() * 2);
}

// storage.listSensors().then((sensors) => sensors.forEach((sensor) => console.log(sensor.data())))

let players = [
  {
    id: "0013a20041fb76ea",
    name: "Player 1",
    team: "Rouge",
    isCapture: false,
    points: 0,
  },
  // {
  //   id: "0013A20041A72946",
  //   name: "Player 2",
  //   team: "Bleu",
  //   isCapture: false,
  //   points: 0,
  // },
];
let flags = [
  {
    id: "0013a20041fb9bee",
    team: "Bleu",
    name: "Flag 1",
    status: "Free",
    player: null,
  },
  {
    id: "0013A20041A72946",
    team: "Rouge",
    name: "Flag 2",
    status: "Free",
    player: null,
  },
];

xbeeAPI.parser.on("data", function (frame) {
  if (C.FRAME_TYPE.NODE_IDENTIFICATION === frame.type) {
    if (frame.nodeIdentifier.split(" ")[0] === "Player") {
      const player = players.find((e) => e.name === frame.nodeIdentifier);

      if (player) {
        player.id = frame.remote64;
      }
    }
    if (frame.nodeIdentifier.split(" ")[0] === "Flag") {
      const flag = flags.find((e) => e.name === frame.nodeIdentifier);

      if (flag) {
        flag.id = frame.remote64;
      }
    }
  }
});

//TODO Vérifier les status (joueur pas pareil que flag si peu joueurs )
xbeeAPI.parser.on("data", function (frame) {
  let player;
  let flag;

  if (frame.digitalSamples) {
    if (frame.digitalSamples.DIO2 === 1) {
      player = players.find((e) => e.id === frame.remote64.toString());

      if (player.isCapture) {
        flags.forEach((flag) => {
          if (flag.team !== player.team && flag.status == "Captured") {
            flag.status = "Free";
            player.isCapture = false;
            player.points -= 5;
          } else {
            console.log("Il n'avait pas de drapeau");
          }
        });
      } else {
        player.isCapture = true;
      }
    }

    players.forEach((player) => {
      if (player.isCapture === true) {
        if (
          frame.digitalSamples.DIO0 === 1 ||
          frame.digitalSamples.DIO1 === 1
        ) {
          flag = flags.find((e) => e.id === frame.remote64.toString());

          if (flag.team !== player.team) {
            flag.status = "Captured";
            player.isCapture = false;

            players.forEach((player) => {
              if (player.team !== flag.team) {
                player.points += 5;
              } else {
                player.points -= 5;
              }
            });
          } else if (flag.team === player.team && flag.status === "Captured") {
            flag.status = "Returning";
            player.points += 5;
          }
          if (flag.team === player.team && flag.status === "Returning") {
            flag.status = "Free";
            player.points += 10;
          }
        }
      }
    });
  }
});

// xbeeAPI.parser.on("data", function (frame) {
//   if (frame.digitalSamples) {
//     if (frame.digitalSamples.DIO2 === 1) {
//       const player = players.find((e) => e.id === frame.remote64.toString());
//       // console.log(player);
//       if (player) {
//         // console.log(players);
//         // console.log(flags);
//         const flag = flags.map((e) => e.id);
//         console.log(flag);
//         // if (flag.team !== player.team) {
//         //   console.log("flag taken");
//         //   // flag.status = "Taken";
//         //   // flag.player = player;
//         // } else {
//         //   console.log("flag taken by same team");
//         // }
//       }
//     } else {
//       console.log("press released");
//       // console.log("frame btn", frame);
//       // console.log("DIO2: ", frame.digitalSamples.DIO2);
//     }
//   }
// });

client.on("message", function (topic, message) {
  console.log("get");
  if (topic === "IOT/CTF/players" && message.toString() === "get") {
    // console.log(players);
    client.publish("IOT/CTF/players", JSON.stringify(players));
  } else if (topic === "IOT/CTF/flags" && message.toString() === "get") {
    // console.log(flags);
    client.publish("IOT/CTF/flags", JSON.stringify(flags));
  }
});
