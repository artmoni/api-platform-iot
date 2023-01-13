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
    numero: ni
  }

  await docRef.get().then((snapshotDoc) => {
    if (!snapshotDoc.exists)
      docRef.set(machine);
    else
      docRef.update(machine);
  })
}


module.exports.listCaisse = function () {

  const docRef = db.collection('caisse');

  return docRef.get()

}

module.exports.getNIChange = async function (ni, adress) {
   
  return ni, adress


}

module.exports.isUnavailable = async function (adress, available) {
  const docRef = db.collection('caisse').doc(adress);
  const machine = {
    id: adress,
    disponibilite: available,
    isPlugged: true
  }
  await docRef.get().then((snapshotDoc) => {
    docRef.update(machine);
  })
}

module.exports

