const { admin, db } = require('./admin');

///////// MIDDLEWARE ///////////////////////////
// intercepts request and determines whether we want to accept or not
/**
 * Firebase Authentication
 * If a header containing authorization exists,
 * ( by convention, include Bearer in request )
 * @param {*} next calls the next handler
 */
module.exports = (req, res, next) => {
  const containsAuth = req.headers.authorization && req.headers.authorization.startsWith('Bearer ');
  let idToken;

  if (containsAuth) {
    idToken = req.headers.authorization.split('Bearer ')[1]; // returns ['Bearer ', 'token']
  } else {
    console.error('No token found');
    // unauthorized error
    return res.status(403).json({ error: 'Unauthorized' });
  }

  // Now verify that this token was issued by OUR application
  // and NOT smne else !!
  admin.auth().verifyIdToken(idToken)
    .then(decodedToken => {
      // This decoded token contains user data from Firebase Authentication that we can use
      // So we need to APPEND that user data to the REQUEST object
      // so that it can proceed to next handler with authorization
      // The request obj now contains extra data about a user that the next handler can use !!
      req.user = decodedToken; // only contains email, token and user UID, no username from Firebase Authentication !
      // we want to associated that user UID from authentication with the user document as field userId
      // UID was set as userId during signup
      console.log(decodedToken);
      // We need to fetch the USERNAME from the database
      // simple query : https://firebase.google.com/docs/firestore/query-data/queries
      // limits to 1 document
      // get() retrieves result after executing query
      return db.collection('users')
        .where('userId', '==', req.user.uid)
        .limit(1)
        .get();
    })
    .then(dataInArray => {
      // the db query returned an array of 1 doc that we need to access
      // dataInArray = [doc]
      // data().field extracts field data from the doc element
      // add a key to request.user that is username
      req.user.username = dataInArray.docs[0].data().username;
      req.user.imageUrl = dataInArray.docs[0].data().imageUrl; // for comment image
      return next();
    })
    .catch(err => {
      console.error('Error while verifying token ', err);
      return res.status(403).json(err); // err is already a json
    })
}