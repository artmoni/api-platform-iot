const admin = require('firebase-admin');
const serviceAccount = require('./serviceAccountKey.json');

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});

const db = admin.firestore();


module.exports.registerMachine = async function (adress, ni = "") {

  const docRef = db.collection('caisse').doc(adress);

  const machine = {
    id: adress,
    disponibilite: true,
    isPlugged: true,
    numero: ''
  }

  await docRef.get().then((snapshotDoc) => {
    if (!snapshotDoc.exists)
      docRef.set(machine);
    else
      docRef.update(machine);
  })
}

module.exports.registerSample = async function (address, sample) {

  const docRef = db.collection('sensors').doc(address)
    .collection('samples').doc(Date.now().toString());

  const data = {
    value: sample,
    date: Date.now(),
  }
  await docRef.set(data);


}

module.exports.listSensors = function () {

  const docRef = db.collection('sensors');

  return docRef.get()

}

module.exports

