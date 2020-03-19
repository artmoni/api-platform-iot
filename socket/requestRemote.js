const axios = require('axios');


module.exports =  {

  getListGame: () => {
    axios.get('https://localhost:8443/games')
      .then(function (response) {
        console.log(response.data);
      })
      .catch(function (error) {
        console.log(error);
      })
  },

  addGame: () => {
    // Send a POST request
    axios({
      method: 'post',
      url: 'https://localhost:8443/games',
      data: {
        "name": "adrienTestGame4hg",
        "maxPlayer": 10
      }
    })
      .then(function (response) {
        console.log(response.data);
      })
      .catch(function (error) {
        console.log(error);
      })
  },

  addPlayer: () => {
    // Send a POST request
    axios({
      method: 'post',
      url: 'https://localhost:8443/players',
      data: {
        "macAddress": "0013A2004147961D",
        "game": "adrienTestGame3"
      }
    })
      .then(function (response) {
        console.log(response.data);
      })
      .catch(function (error) {
        console.log(error);
      })
  },

  getListPlayer: () => {
    axios.get('https://localhost:8443/players')
      .then(function (response) {
        console.log(response.data);
      })
      .catch(function (error) {
        console.log(error);
      })
  },
}












