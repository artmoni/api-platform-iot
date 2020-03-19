const axios = require('axios');


module.exports =  {

  addGame: () => {
    // Send a POST request
    axios({
      method: 'post',
      url: 'https://localhost:8443/games',
      data: {
        "name": "adrienTestGame2",
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
        //data
      }
    })
      .then(function (response) {
        console.log(response.data);
      })
      .catch(function (error) {
        console.log(error);
      })
  },

  getListGame: () => {
    axios.get('https://localhost:8443/greetings?page=1')
      .then(function (response) {
        console.log(response.data);
      })
      .catch(function (error) {
        console.log(error);
    })
  },
}












