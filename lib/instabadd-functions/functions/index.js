const functions = require("firebase-functions");
const express = require("express");
const app = express();
// adds headers to signal everyone they can use this resource, middleware
const cors = require("cors");
if (process.env.NODE_TEST === "unitTest") {
  // console.log("using parserrrr");
  app.use(express.json());
}
app.use(cors());

const {
  getAllPosts,
  createPost,
  getPost,
  commentOnPost,
  deleteComment,
  deletePost
} = require("./handlers/posts");
const {
  signup,
  login,
  uploadImage,
  addUserDetails,
  getAuthenticatedUser,
  getUserDetails,
  getAllUsers,
  getUserDetailsAndFollowing,
  markNotificationsRead,
  followUser,
  unfollowUser
} = require("./handlers/users");
const FBAuth = require("./util/fbAuth");
const { db } = require("./util/admin");

// POSTS ROUTES //////////////////////////////////////////////////////////////
// exports.getPosts = functions.https.onRequest((req, res) => {
app.get("/posts", getAllPosts);
// This route should be protected.
// Only authenticated users with a token can make a post
// Each Post doc has a username associated to it that can
// identify who it belongs to
// This is protected by FBAuth. So an error will occur if not Authenticated
// and won't actually post
// THus, a TOKEN is REQUIRED to POST
// If we do make it to the last handler, then we must be authenticated
// exports.createPost = functions.https.onRequest((req, res) => {
app.post("/post", FBAuth, createPost);
// app.post('/post', FBAuth, uploadImage, createPost);
app.delete("/post/:postId", FBAuth, deletePost);
app.get("/post/:postId", getPost);
app.post("/post/:postId/comment", FBAuth, commentOnPost);
app.delete("/comment/:commentId", FBAuth, deleteComment);

// USERS routes
app.post("/signup", signup);
app.post("/login", login);
app.post("/user/image", FBAuth, uploadImage);
app.post("/user", FBAuth, addUserDetails);
app.get("/user", FBAuth, getAuthenticatedUser);
// get any user's details, is a public route
app.get("/user/:username", getUserDetails);
// get list of all users
app.get("/users", getAllUsers);
// if a user is logged in and wants to get any user's details,
// including whether the logged in user is following this other user
// they must be authenticated to see whether they are following smne
app.get("/user/:signedInAs/:username", FBAuth, getUserDetailsAndFollowing);
app.post("/notifications", FBAuth, markNotificationsRead);
app.post("/user/:signedInAs/following/:username", FBAuth, followUser);
app.post("/user/:signedInAs/unfollowing/:username", FBAuth, unfollowUser);

// as good practice, we want the prefix api and not just nameOfSite.com/pathToGoToStraightaway
// https://baseurl.com/api
// This will handle multiple routes
// on firebase : https://us-central1-instabadd-3c56a.cloudfunctions.net/api
// then https://us-central1-instabadd-3c56a.cloudfunctions.net/api/posts in postman to get posts
exports.api = functions.https.onRequest(app);

exports.createNotificationOnPost = functions
  .region("us-central1")
  .firestore.document("posts/{id}")
  .onCreate(snapshot => {
    // snapshot is data for the post just made for user20
    return db
      .doc(`/followers/${snapshot.data().username}`)
      .get()
      .then(doc => {
        // doc is data of followers for the user20
        if (doc.exists) {
          const batch = db.batch();
          const data = doc.data();

          for (const key in data) {
            let docRef = db.doc(
              `/notifications/${snapshot.id}-${Math.round(
                Math.random() * 100000
              )}`
            );

            batch.set(docRef, {
              createdAt: new Date().toISOString(),
              recipient: key,
              sender: snapshot.data().username,
              type: "post",
              read: false,
              postId: snapshot.id
            });
          }
          return batch.commit();
        }
      })
      .then(() => {
        // res.json({
        //   message: "Notifications created successfully for new Post"
        // });
      })
      .catch(err => {
        console.error(err);
        return;
      });
  });

exports.createNotificationOnComment = functions
  // .database.ref('/comments/{postId}')
  .region("us-central1")
  .firestore.document("comments/{id}")
  .onCreate(snapshot => {
    return db
      .doc(`/posts/${snapshot.data().postId}`)
      .get()
      .then(doc => {
        if (doc.exists && doc.data().username !== snapshot.data().username) {
          return db.doc(`/notifications/${snapshot.id}`).set({
            createdAt: new Date().toISOString(),
            recipient: doc.data().username,
            sender: snapshot.data().username,
            type: "comment",
            read: false,
            postId: doc.id,
            commentId: snapshot.id
          });
        }
      })
      .catch(err => {
        console.error(err);
        return;
      });
  });

exports.onPostDelete = functions
  .region("us-central1")
  .firestore.document("/posts/{postId}")
  .onDelete((snapshot, context) => {
    const postId = context.params.postId;
    const batch = db.batch();
    return db
      .collection("comments")
      .where("postId", "==", postId)
      .get()
      .then(data => {
        data.forEach(doc => {
          batch.delete(db.doc(`/comments/${doc.id}`));
        });
        return db
          .collection("notifications")
          .where("postId", "==", postId)
          .get();
        // return db
        //   .collection('likes')
        //   .where('screamId', '==', screamId)
        //   .get();
        // })
        // .then((data) => {
        //   data.forEach((doc) => {
        //     batch.delete(db.doc(`/likes/${doc.id}`));
        //   });
        // return db
        //   .collection('notifications')
        //   .where('screamId', '==', screamId)
        //   .get();
      })
      .then(data => {
        data.forEach(doc => {
          batch.delete(db.doc(`/notifications/${doc.id}`));
        });
        return batch.commit();
      })
      .catch(err => console.error(err));
  });

exports.onCommentDelete = functions
  .region("us-central1")
  .firestore.document("/comments/{commentId}")
  .onDelete((snapshot, context) => {
    // notifications id is same as comment id
    const commentId = context.params.commentId;
    // const batch = db.batch();

    return db
      .collection("notifications")
      .where("commentId", "==", commentId)
      .get()
      .then(() => {
        // resolves data
        db.doc(`/notifications/${snapshot.id}`).delete();
      })
      .catch(err => console.error(err));
  });
