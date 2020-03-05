const admin = require('firebase-admin');
const serviceAccount = require('./instabadd-3c56a-b8952ebf3e35.json');
// use admin by initializing application
// already has id of our project on firebase in .firebaserc
// https://stackoverflow.com/questions/58127896/error-could-not-load-the-default-credentials-firebase-function-to-firestore
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: "https://instabadd-3c56a.firebaseio.com",
  storageBucket: "instabadd-3c56a.appspot.com"
});
const db = admin.firestore();

module.exports = {
  admin,
  db
};