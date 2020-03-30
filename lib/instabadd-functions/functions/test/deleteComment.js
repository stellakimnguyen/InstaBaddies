const { db } = require("../util/admin");
require("dotenv").config();

const sinon = require("sinon");
const request = require("supertest");

describe("DELETE /comment/:commentId deleteComment", function() {
  let myFunctions;
  beforeEach(function() {
    // console.log("env  before set: ", process.env.NODE_TEST);
    process.env.NODE_TEST = "unitTest";
    // console.log("env  after set: ", process.env.NODE_TEST);

    // after you can create app:
    myFunctions = require("../index");
    // delete require.cache[require.resolve("../index")];
    // require("../index");
  });
  afterEach(function() {
    sinon.restore();
    process.env.NODE_TEST = "notTest";
    delete require.cache[require.resolve("../index")];
    // console.log("env after setback: ", process.env.NODE_TEST);
  });
  it("responds with status 200 and json", function(done) {
    const req = {
      commentId: "commentId101",
      user: {
        username: "randy101",
        postId: "bleh101",
        imageUrl: "www.randy.com"
      }
    };
    const updateStub = sinon.stub();
    const doc1 = {
      exists: true,
      ref: { update: updateStub },
      data: () => {
        let username = "randy101";
        return username;
      }
    };

    const dbDocStub = sinon.stub(db, "doc").withArgs("/comments/:commentId");
    const docDataStub = sinon.stub(doc1, "data");
    const getStub = sinon.stub();
    const deleteStub = sinon.stub();

    dbDocStub.onCall(0).returns({ get: getStub });
    getStub.returns(Promise.resolve(doc1));
    docDataStub.returns({ username: "randy101" });
    dbDocStub.onCall(1).returns({ delete: deleteStub });

    request(myFunctions.api)
      .delete("/comment/:commentId")
      .send(req)
      .set("Accept", "application/json")
      .expect("Content-Type", /json/)
      .expect(200)
      .expect(function(res) {
        res.body.message = "Comment deleted Successfully";
      })
      .then(() => {
        // res
        done();
      })
      .catch(err => {
        console.error("error : ", err);
        done(err);
      });
  });
  it("responds with status 403 and json", function(done) {
    const req = {
      commentId: "commentId101",
      user: {
        username: "randy101",
        postId: "bleh101",
        imageUrl: "www.randy.com"
      }
    };
    const updateStub = sinon.stub();
    const doc1 = {
      exists: true,
      ref: { update: updateStub },
      data: () => {
        let username = "randy101";
        return username;
      }
    };

    const dbDocStub = sinon.stub(db, "doc").withArgs("/comments/:commentId");
    const docDataStub = sinon.stub(doc1, "data");
    const getStub = sinon.stub();
    const deleteStub = sinon.stub();

    dbDocStub.onCall(0).returns({ get: getStub });
    getStub.returns(Promise.resolve(doc1));
    docDataStub.returns({ username: "randy102" });
    dbDocStub.onCall(1).returns({ delete: deleteStub });

    // will see unhandledPromiseRejectionWarning because supertest request
    // is actually continues after the return and keeps resetting the
    // res.json
    request(myFunctions.api)
      .delete("/comment/:commentId")
      .send(req)
      .set("Accept", "application/json")
      .expect("Content-Type", /json/)
      .expect(403)
      .expect(function(res) {
        res.body.error = "Unauthorized";
      })
      .then(() => {
        // res
        done();
      })
      .catch(err => {
        console.error("error : ", err);
        done(err);
      });
  });
  it("responds with status 404 and json", function(done) {
    const req = {
      commentId: "commentId101",
      user: {
        username: "randy101",
        postId: "bleh101",
        imageUrl: "www.randy.com"
      }
    };
    const updateStub = sinon.stub();
    const doc1 = {
      exists: false,
      ref: { update: updateStub },
      data: () => {
        let username = "randy101";
        return username;
      }
    };

    const dbDocStub = sinon.stub(db, "doc").withArgs("/comments/:commentId");
    const docDataStub = sinon.stub(doc1, "data");
    const getStub = sinon.stub();

    dbDocStub.onCall(0).returns({ get: getStub });
    getStub.returns(Promise.resolve(doc1));
    docDataStub.returns({ username: "randy102" });

    // will see unhandledPromiseRejectionWarning because supertest request
    // is actually continues after the return and keeps resetting the
    // res.json
    request(myFunctions.api)
      .delete("/comment/:commentId")
      .send(req)
      .set("Accept", "application/json")
      .expect("Content-Type", /json/)
      .expect(404)
      .expect(function(res) {
        res.body.error = "Comment not found";
      })
      .then(() => {
        // res
        done();
      })
      .catch(err => {
        console.error("error : ", err);
        done(err);
      });
  });
});
