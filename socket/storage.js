const admin = require('firebase-admin');
const serviceAccount = require('./serviceAccountKey.json');

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});

const db = admin.firestore();


module.exports.registerSensor = async function (address) {

  const docRef = db.collection('sensors').doc(address);

  const sensor = {
    address: address,
    date: Date.now(),
  }

  await docRef.get().then((snapshotDoc)=> {
    if (!snapshotDoc.exists)
      docRef.set(sensor);
    else
      docRef.update(sensor);
  })
}



