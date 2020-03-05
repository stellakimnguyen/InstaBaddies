const { admin, db } = require("../util/admin");
const config = require("../util/config");
const firebase = require("firebase");
firebase.initializeApp(config);
const {
  validateSignupData,
  validateLoginData,
  reduceUserDetails
} = require("../util/validators");

exports.signup = (req, res) => {
  const newUser = {
    email: req.body.email,
    password: req.body.password,
    confirmPassword: req.body.confirmPassword,
    username: req.body.username
  };

  /// VALIDATION  FOR SIGNUP ROUTE       ///////////////////////
  // destructure the data from return object {errors, valid: true or false}
  const { valid, errors } = validateSignupData(newUser);

  if (!valid) return res.status(400).json(errors);
  // else carry on
  //////////////// END VALIDATION //////////////////

  //////////////// get DEFAULT no-img.png as profile ///////////////
  const noImg = "no-img.png";

  // whether an email is provided or not,
  // firebase will check if the username exists in the collection
  // but we want it to not even check if the email is not provided (validation)

  // checks users collection for a document with this inputted username
  // get() returns a promise
  let token;
  db.doc(`/users/${newUser.username}`)
    .get()
    .then(doc => {
      // then block MUST return smt
      // even if the doc doesn't exist, the snapshot will,
      // so must verify it exists
      if (doc.exists) {
        return res
          .status(400)
          .json({ username: "This username is already taken" });
      } else {
        // this should return data to next then block
        // upon successful creation
        // If the new account was created, the user is signed in automatically
        return firebase
          .auth()
          .createUserWithEmailAndPassword(newUser.email, newUser.password);
      }
    })
    .then(data => {
      // have access to USER ID here !!
      userId = data.user.uid;

      // we want an authentication token that we can give our user
      // so that this new user can access more data
      return data.user.getIdToken();
    })
    .then(idToken => {
      // after credential validation from firebase succeeds,
      // create this new user document
      // if property/attribute has same name, can use it
      // dont need userId: userId
      token = idToken;
      const userCredentials = {
        username: newUser.username,
        email: newUser.email,
        createdAt: new Date().toISOString(),
        imageUrl: `https://firebasestorage.googleapis.com/v0/b/${config.storageBucket}/o/${noImg}?alt=media`,
        userId
      };
      // now persist credentials in a document in our users collection
      return db.doc(`/users/${newUser.username}`).set(userCredentials);
      // return res.status(201).json({ token });
    })
    .then(() => {
      // since this is last then block,
      // should see this in postman
      return res.status(201).json({ token });
    })
    .catch(err => {
      console.error(err);

      // if get 500 error for client using existing email, we
      // should say it's their fault, not ours
      if (err.code === "auth/email-already-in-use") {
        // the json attribute is what the error pertains to
        return res.status(400).json({ email: "Email is already in use" });
      } else {
        return res
          .status(500)
          .json({ general: "Something went wrong, please try again" });
      }
    });
  // this was replaced by above
  // use firebase library to create user
  // firebase
  //   .auth()
  //   .createUserWithEmailAndPassword(newUser.email, newUser.password)
  //   .then(data => {
  //     // successful creation
  //     return res.status(201).json({ message: `user ${data.user.uid} signed up successfully` });
  //   })
  //   .catch(err => {
  //     console.error(err);
  //     return res.status(500).json({ error: err.code });
  //   })
};

exports.login = (req, res) => {
  const user = {
    email: req.body.email,
    password: req.body.password
  };
  /////////// LOGIN VALIDATION ////////////////
  const { errors, valid } = validateLoginData(user);
  if (!valid) return res.status(400).json(errors);
  /////////// END LOGIN VALIDATION ////////////

  ////////// Check firebase after passing validation //////////
  firebase
    .auth()
    .signInWithEmailAndPassword(user.email, user.password)
    .then(data => {
      // give user a token to access restricted data
      return data.user.getIdToken();
    })
    .then(token => {
      return res.json({ token });
    })
    .catch(err => {
      console.error(err);
      // auth/wrong-password
      // auth/user-not-user
      return res
        .status(403)
        .json({ general: "Wrong credentials, please try again" });
    });
};

// Add user details
exports.addUserDetails = (req, res) => {
  let userDetails = reduceUserDetails(req.body);

  // look for specific user in db then add these fields or update
  db.doc(`/users/${req.user.username}`)
    .update(userDetails)
    .then(() => {
      return res.json({ message: "Details added successfully" });
    })
    .catch(err => {
      console.error(err);
      return res.status(500).json({ error: err.code });
    });
};

// Get any user's details
exports.getUserDetails = (req, res) => {
  let userData = {};
  // Find username in DB then extract that user's document info
  db.doc(`/users/${req.params.username}`)
    .get()
    .then(doc => {
      if (doc.exists) {
        userData.user = doc.data();
        // want to display that user's Posts, so look in Posts collection for posts with corresponding username
        return db
          .collection("posts")
          .where("username", "==", req.params.username)
          .orderBy("createdAt", "desc")
          .get(); // returns a promise and data related to this query
      } else {
        return res.status(404).json({ error: "User not found" });
      }
    })
    .then(data => {
      // data is an array of documents matching the query above : posts with corresponding username
      userData.posts = [];
      data.forEach(doc => {
        userData.posts.push({
          createdAt: doc.data().createdAt,
          username: doc.data().username,
          userImage: doc.data().userImage,
          postImage: doc.data().postImage,
          commentCount: doc.data().commentCount,
          postId: doc.id
        });
      });
      return res.json(userData);
    })
    .catch(err => {
      console.error(err);
      return res.status(500).json({ error: err.code });
    });
};

exports.getUserDetailsAndFollowing = (req, res) => {
  let userData = {};
  // Find username in DB then extract that user's document info
  db.doc(`/users/${req.params.username}`)
    .get()
    .then(doc => {
      if (doc.exists) {
        userData.user = doc.data();
        // want to display that user's Posts, so look in Posts collection for posts with corresponding username
        return db
          .collection("posts")
          .where("username", "==", req.params.username)
          .orderBy("createdAt", "desc")
          .get(); // returns a promise and data related to this query
      } else {
        return res.status(404).json({ error: "User not found" });
      }
    })
    .then(data => {
      // data is an array of documents matching the query above : posts with corresponding username
      userData.posts = [];
      data.forEach(doc => {
        userData.posts.push({
          createdAt: doc.data().createdAt,
          username: doc.data().username,
          userImage: doc.data().userImage,
          postImage: doc.data().postImage,
          commentCount: doc.data().commentCount,
          postId: doc.id
        });
      });
      // return res.json(userData);
      ///////////////////////////////
      return db.doc(`/following/${req.user.username}`).get(); // look for doc for user that is logged in in following collection

      //////////////////////////////
    })
    .then(doc => {
      if (doc.exists) {
        const data = doc.data();
        userData.isFollowing = false;
        for (const key in data) {
          if (req.params.username === key) {
            userData.isFollowing = true;
            return res.json(userData);
          }
        }
      } else {
        return res.json({ message: "Could not identify following status" });
      }
      return res.json(userData); // if that user logged in is NOT following that person, should still send isFollowing=false
    })
    .catch(err => {
      console.error(err);
      return res.status(500).json({ error: err.code });
    });
};

// Get OWN USER details
exports.getAuthenticatedUser = (req, res) => {
  let userData = {};

  db.doc(`/users/${req.user.username}`)
    .get()
    .then(doc => {
      if (doc.exists) {
        userData.credentials = doc.data();
        console.log(doc.id);
        return db
          .collection("posts")
          .where("username", "==", req.user.username)
          .get();
      }
    })
    .then(data => {
      // Once here, we know the user exists for sure, so get all their posts and notifications to show them
      userData.posts = [];
      data.forEach(doc => {
        userData.posts.push(doc.data());
      });
      // return res.json(userData);
      // want to return notifications so they can be received on the front end
      return db
        .collection("notifications")
        .where("recipient", "==", req.user.username)
        .orderBy("createdAt", "desc")
        .get(); // returns a promise with data
    })
    .then(data => {
      // data is an array of documents that matched above query from notifications collection
      userData.notifications = [];
      data.forEach(doc => {
        userData.notifications.push({
          // push all fields from the notification document one by one
          recipient: doc.data().recipient,
          sender: doc.data().sender,
          createdAt: doc.data().createdAt,
          postId: doc.data().postId,
          type: doc.data().type,
          read: doc.data().read,
          notificationId: doc.id
        });
      });
      return res.json(userData);
    })
    .catch(err => {
      console.error(err);
      return res.status(500).json({ error: err.code });
    });
};

// Upload a profile image for user, it can be replaced
exports.uploadImage = (req, res) => {
  console.log("i am trying to upload an image hereee");
  // on postman, body is form-data, key is image and its type is File, then for value, choose a jpg or png
  const Busboy = require("busboy");
  const path = require("path");
  const os = require("os");
  const fs = require("fs");

  const busboy = new Busboy({ headers: req.headers });

  let imageFileName;
  let imageToBeUploaded = {};

  busboy.on("file", (fieldname, file, filename, encoding, mimetype) => {
    console.log(fieldname, file, filename, encoding, mimetype);

    if (mimetype !== "image/jpeg" && mimetype !== "image/png") {
      return res.status(400).json({ error: "Wrong file type submitted" });
    }

    // my.image.png => ['my', 'image', 'png']
    // need to acces last item in array
    const indexOfExtension = filename.split(".").length - 1;
    const imageExtension = filename.split(".")[indexOfExtension];

    // create image file name
    // 20842832832083.png
    imageFileName = `${Math.round(
      Math.random() * 100000000000
    )}.${imageExtension}`;

    // the filepath will be based on Cloud functions
    // Returns the operating system's default directory for temporary files as a string.
    const filepath = path.join(os.tmpdir(), imageFileName);
    // file object containing specs is created here
    imageToBeUploaded = { filepath, mimetype };

    // Now need to actually create the file using the filesystem LIBRARY
    // we write to this file, provided this filepath.
    file.pipe(fs.createWriteStream(filepath));
  });
  busboy.on("finish", () => {
    admin
      .storage()
      .bucket()
      .upload(imageToBeUploaded.filepath, {
        resumable: false,
        metadata: {
          metadata: {
            contentType: imageToBeUploaded.mimetype
          }
        }
      })
      .then(() => {
        // now need to construct image url and associate it to a user ie add it to user doc
        // user doc needs a field called imageUrl that will be the following

        // alt=media ensures image is shown on browser and not downloaded onto device
        const imageUrl = `https://firebasestorage.googleapis.com/v0/b/${config.storageBucket}/o/${imageFileName}?alt=media`;
        // we know for sure that the user has been authenticated already so we can use req.user
        // update() updates a field or adds if DNE
        return db.doc(`/users/${req.user.username}`).update({ imageUrl }); // returns a promise
      })
      .then(() => {
        res.json({ message: "Image uploaded successfully" });
      })
      .catch(err => {
        console.error("hiiiiiiiiiiiiiiiiiiiiiiii", err);
        return res.status(500).json({ error: err.code });
      });
  });
  busboy.end(req.rawBody);
};

exports.markNotificationsRead = (req, res) => {
  // afte a user views a notification, we want to notify the server what was read
  // and mark it as read then change the unread to read on client side
  // batch handles multiple modifications in DB
  let batch = db.batch();

  // we will receive an ARRAY of notification IDs in the request body
  req.body.forEach(notificationId => {
    const notification = db.doc(`/notifications/${notificationId}`);
    // batch.update(reference to document we want to modify, what to modify in object)
    batch.update(notification, { read: true });
  });
  batch
    .commit()
    .then(() => {
      return res.json({ message: "Notifications marked read" });
    })
    .catch(err => {
      console.error(err);
      return res.status(500).json({ error: err.code });
    });
};

exports.followUser = (req, res) => {
  const followingRef = db
    .collection("following")
    .doc(`${req.params.signedInAs}`);
  const followersRef = db.collection("followers").doc(`${req.params.username}`);

  followingRef
    .get()
    .then(doc => {
      // https://firebase.google.com/docs/firestore/manage-data/add-data
      // document exists already, so add an attribute to it
      followingRef.set(
        {
          [req.params.username]: true
        },
        { merge: true }
      );

      return followersRef.get();
    })
    .then(doc => {
      followersRef.set(
        {
          [req.params.signedInAs]: true
        },
        { merge: true }
      );
    })
    .then(() => {
      res.json({ message: "Followed user successfully" });
    })
    .catch(err => {
      console.error(err);
      return res.status(500).json({ error: err.code });
    });
};

// https://firebase.google.com/docs/firestore/manage-data/delete-data
// https://javascript.developreference.com/article/10836485/Firestore%3A+Couldn't+Serialize+object+of+type+'ArrayUnionTransform'
exports.unfollowUser = (req, res) => {
  const followingRef = db
    .collection("following")
    .doc(`${req.params.signedInAs}`);
  const followersRef = db.collection("followers").doc(`${req.params.username}`);

  followingRef
    .get()
    .then(doc => {
      if (doc.exists) {
        followingRef.update({
          [req.params.username]: admin.firestore.FieldValue.delete()
        });
      }
      return followersRef.get();
    })
    .then(doc => {
      if (doc.exists) {
        followersRef.update({
          [req.params.signedInAs]: admin.firestore.FieldValue.delete()
        });
      }
    })
    .then(() => {
      res.json({ message: "Unfollowed user successfully" });
    })
    .catch(err => {
      console.error(err);
      return res.status(500).json({ error: err.code });
    });
};
