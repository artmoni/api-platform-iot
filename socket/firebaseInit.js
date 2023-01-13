const i = require('firebase/app') ;
const f = require('firebase/firestore') ;

const firebaseConfig = {
  apiKey: "AIzaSyA2TvywgrLDkCovHJ0tg6Xl-JyM1xn_eo0",
  authDomain: "iocaisse.firebaseapp.com",
  projectId: "iocaisse",
  databaseURL: "https://iocaisse.firebaseio.com",
  storageBucket: "iocaisse.appspot.com",
  messagingSenderId: "96577837334",
  appId: "1:96577837334:web:c5434a29d845de2d539837"
};

// Initialize Firebase

const app = i.initializeApp(firebaseConfig);

module.exports.db = f.getFirestore(app)


