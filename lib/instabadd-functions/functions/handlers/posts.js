const { admin, db } = require("../util/admin");
const config = require("../util/config");

exports.getAllPosts = (req, res) => {
  db.collection("posts")
    .orderBy("createdAt", "desc") // want to order collection of posts by date - most recent - descending order, default is ascending
    .get()
    .then(data => {
      let posts = [];
      // data is an attribute that is an array of docs
      data.forEach(doc => {
        // To populare posts array,
        // doc is aonly a ref, want to get data from it
        // the post id is not provided here
        // posts.push(doc.data())
        /**
         *     {
        "body": "new post 2",
        "username": "user3",
        "createdAt": {
            "_seconds": 1582662790,
            "_nanoseconds": 206000000

         */

        // Want to return post ID upon getting them
        posts.push({
          postId: doc.id,
          userImage: doc.data().userImage,
          username: doc.data().username,
          createdAt: doc.data().createdAt,
          postImage: doc.data().postImage,
          commentCount: doc.data().commentCount
        });
      });
      // return posts as JSON
      return res.json(posts);
    })
    .catch(err => {
      console.error(err);
      res.status(500).json({ error: err.code });
    });
};

exports.createPost = (req, res) => {
  console.log('we are in createPosts in handlers');
  // When a client makes a get request for a POST route,
  // then it yields 500 error when it is not actually our error
  if (req.method != "POST") {
    return res.status(400).json({ error: "Method not allowed" });
  }

  /// upload image for the post to obtain imageURL before creating the POST object ////////////////

  const Busboy = require("busboy");
  const path = require("path");
  const os = require("os");
  const fs = require("fs");

  const busboy = new Busboy({ headers: req.headers });
  let newPost;
  let imageFileName;
  let imageToBeUploaded = {};

  busboy.on("file", (fieldname, file, filename, encoding, mimetype) => {
    console.log(fieldname);
    console.log(filename);
    console.log(mimetype);

    if (mimetype !== "image/jpeg" && mimetype !== "image/png") {
      return res.status(400).json({ error: "Wrong file type submitted" });
    }

    // my.image.png
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
    if (process.env.NODE_TEST === "unitTest") {
      imageToBeUploaded.filepath = "test/randyFreche.jpg";
    }
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
        if (process.env.NODE_TEST === "unitTest") {
          req.user = {
            username: "randy101",
            imageUrl: "www.randyRules.com"
          };
        }
        // now need to construct image url and associate it to a user ie add it to user doc
        // user doc needs a field called imageUrl that will be the following

        // alt=media ensures image is shown on browser and not downloaded onto device
        const imageUrl = `https://firebasestorage.googleapis.com/v0/b/${config.storageBucket}/o/${imageFileName}?alt=media`;

        newPost = {
          // body: req.body.body,
          username: req.user.username,
          createdAt: new Date().toISOString(),
          userImage: req.user.imageUrl,
          commentCount: 0,
          postImage: imageUrl
        };

        // Now persist newPost in firebase database
        return db.collection("posts").add(newPost);
      })
      .then(doc => {
        if (process.env.NODE_TEST === "unitTest") {
          doc = {
            id: "rayndRules101"
          };
        }
        const resPost = newPost;
        resPost.postId = doc.id;
        res.json(resPost);
      })
      .catch(err => {
        console.error(err);
        return res.status(500).json({ error: err.code });
      });
  });
  busboy.end(req.rawBody);

  // db
  //   .collection('followers')
  //   .doc(`${req.user.username}`)
  //   .get()
  //   .then(doc => {
  //     if (doc.exists) {
  //       // Get a new write batch
  //       const batch = db.batch();

  //       const data = doc.data();
  //       console.log(data)
  //       for (const key in data) {
  //         // const value = data[key];
  //         // now key and value are the property name and value

  //         // Set the value of 'NYC' model
  //         // var nycRef = db.collection("cities").doc("NYC");
  //         // batch.set(nycRef, {name: "New York City"});

  //         console.log(key)
  //         let docRef = db
  //           .collection('notifications')
  //           .doc(`${myPostId}-${Math.round(Math.random() * 100000)}`)

  //         batch.set(docRef, {
  //           createdAt: new Date().toISOString(),
  //           recipient: key,
  //           sender: req.user.username,
  //           type: 'post',
  //           read: false,
  //           postId: doc.id
  //         });

  //         // db
  //         //   .collection('notifications')
  //         //   .doc(`${snapshot.id}-${Math.round(Math.random() * 100000)}`)
  //         //   .set({
  //         //     createdAt: new Date().toISOString(),
  //         //     recipient: key,
  //         //     sender: snapshot.data().username,
  //         //     type: 'post',
  //         //     read: false,
  //         //     postId: doc.id
  //         //   });
  //       }
  //       return batch.commit()
  //       // return res.json({ message: "Notifications created successfully for new Post" });
  //     }
  //   })
  //   .then(() => {
  //     return res.json({ message: "Notifications created successfully for new Post" });
  //   })
  //   .catch((err) => {
  //     console.error(err);
  //     return;
  //   });
};

// Fetch 1 Post
exports.getPost = (req, res) => {
  let postData = {};
  // how to retrieve the contents of a single document using get():

  db.doc(`/posts/${req.params.postId}`)
    .get()
    .then(doc => {
      if (!doc.exists) {
        return res.status(404).json({ error: "Post not found" });
      }
      // doc.data() Converts to a Post OBJECT and save in postData so it has the same info rn
      postData = doc.data();
      // doc.data() does NOT contain the postId so we get it through the query snapshot
      postData.postId = doc.id;
      // https://firebase.google.com/docs/firestore/query-data/get-data
      // you can use where() to query for all of the documents that meet a certain condition, then use get() to retrieve the results:
      return db
        .collection("comments")
        .orderBy("createdAt", "desc")
        .where("postId", "==", req.params.postId)
        .get(); // returns a promise
    })
    .then(data => {
      // data is an array of comment documents
      // found all comments associated to a single postId
      postData.comments = [];

      // each doc is a comment obj
      data.forEach(doc => {
        postData.comments;
        //todo: attach doc.id to a comments object that also has doc.data() then push to comments array to have commentId
        postData.comments.push(doc.data());
        postData.comments[postData.comments.length - 1].commentId = doc.id;
      });
      return res.json(postData);
    })
    .catch(err => {
      console.error(err);
      res.status(500).json({ error: err.code });
    });
};

// Comment on a Post
exports.commentOnPost = (req, res) => {
  if (process.env.NODE_TEST === "unitTest") {
    req.user = {
      username: "randy101",
      postId: "bleh101",
      imageUrl: "www.randy.com"
    };
  }
  if (req.body.body.trim() === "")
    return res.status(400).json({ comment: "Must not be empty" });

  const newComment = {
    body: req.body.body,
    createdAt: new Date().toISOString(),
    postId: req.params.postId,
    username: req.user.username,
    userImage: req.user.imageUrl
  };

  // ensure the post for postId EXISTS
  // then add comment to comments collection
  db.doc(`/posts/${req.params.postId}`)
    .get()
    .then(doc => {
      if (!doc.exists) return res.status(404).json({ error: "Post not found" });

      return doc.ref.update({ commentCount: doc.data().commentCount + 1 });
    })
    .then(() => {
      // add() adds a document using a newComment JSON after verifying the post exists
      return db.collection("comments").add(newComment); // returns a doc ref
    })
    .then(doc => {
      if (process.env.NODE_TEST === "unitTest") {
        doc = {
          id: "rayndRules101"
        };
      }
      const resComment = newComment;
      resComment.commentId = doc.id;
      res.json(resComment); // must give to user interface
    })
    .catch(err => {
      console.error(err);
      return res.status(500).json({ error: "Something went wrong" });
    });
};

// Delete a Post
exports.deletePost = (req, res) => {
  if (process.env.NODE_TEST === "unitTest") {
    req.user = {
      username: "randy101"
    };
  }
  let document = db.doc(`/posts/${req.params.postId}`);

  document
    .get()
    .then(doc => {
      if (!doc.exists) return res.status(404).json({ error: "Post not found" });
      // check if username on the POst is the same as the username that is requesting this deletion
      if (doc.data().username !== req.user.username) {
        return res.status(403).json({ error: "Unauthorized" });
      } else {
        if (process.env.NODE_TEST === "unitTest") {
          document = db.doc(`/posts/${req.params.postId}`);
        }
        return document.delete();
      }
    })
    .then(() => {
      res.json({ message: "Post deleted Successfully" });
    })
    .catch(err => {
      console.error(err);
      return res.status(500).json({ error: err.code });
    });
};

exports.deleteComment = (req, res) => {
  if (process.env.NODE_TEST === "unitTest") {
    req.user = {
      username: "randy101",
      postId: "bleh101",
      imageUrl: "www.randy.com"
    };
  }
  let document = db.doc(`/comments/${req.params.commentId}`);
  document
    .get()
    .then(doc => {
      if (!doc.exists)
        return res.status(404).json({ error: "Comment not found" });
      // check if username on the comment is the same as the username that is requesting this deletion
      else if (doc.data().username !== req.user.username) {
        return res.status(403).json({ error: "Unauthorized" });
      } else {
        if (process.env.NODE_TEST === "unitTest") {
          document = db.doc(`/comments/${req.params.commentId}`);
        }
        return document.delete();
      }
    })
    .then(() => {
      res.json({ message: "Comment deleted Successfully" });
    })
    .catch(err => {
      console.error(err);
      return res.status(500).json({ error: err.code });
    });
};
