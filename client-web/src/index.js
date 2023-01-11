import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import firebase from "firebase/app";
import {combineReducers, createStore} from "redux";
import {firebaseReducer,   ReactReduxFirebaseProvider,} from "react-redux-firebase";
import {createFirestoreInstance, firestoreReducer} from "redux-firestore";
import {Provider} from "react-redux";
import 'firebase/firestore'

const firebaseConfig = {
  apiKey: "AIzaSyA2TvywgrLDkCovHJ0tg6Xl-JyM1xn_eo0",
  authDomain: "iocaisse.firebaseapp.com",
  projectId: "iocaisse",
  storageBucket: "iocaisse.appspot.com",
  messagingSenderId: "96577837334",
  appId: "1:96577837334:web:c5434a29d845de2d539837"
};
const rrfConfig = {
  userProfile: 'sensors',
  // useFirestoreForProfile: true // Firestore for Profile instead of Realtime DB
}

firebase.initializeApp(firebaseConfig)
firebase.firestore()


const rootReducer = combineReducers({
  firebase: firebaseReducer,
  firestore: firestoreReducer
})

const initialState = {}
const store = createStore(rootReducer, initialState)

const rrfProps = {
  firebase,
  config: rrfConfig,
  dispatch: store.dispatch,
  createFirestoreInstance
}

ReactDOM.render(
    <Provider store={store}>
      <ReactReduxFirebaseProvider {...rrfProps}>
        <App/>
      </ReactReduxFirebaseProvider>
    </Provider>,
  document.getElementById('root')
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
