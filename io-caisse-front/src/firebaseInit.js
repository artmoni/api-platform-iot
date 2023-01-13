import {initializeApp} from "firebase/app";

import {getFirestore} from "firebase/firestore";

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

const app = initializeApp(firebaseConfig);

export const db = getFirestore(app)


