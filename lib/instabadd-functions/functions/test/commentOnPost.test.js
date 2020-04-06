const { db } = require("../util/admin");
require("dotenv").config();

const sinon = require("sinon");
const { expect } = require("chai");
const request = require("supertest");

describe("POST /post/:postId/comment commentOnPost", function() {
  let myFunctions;
  beforeEach(function() {
    process.env.NODE_TEST = "unitTest";

    // after you can create app:
    myFunctions = require("../index");
  });
  afterEach(function() {
    sinon.restore();
    process.env.NODE_TEST = "notTest";
    delete require.cache[require.resolve("../index")];
  });
  it("responds with status 200 and json", function(done) {
    const req = {
      body: "this is a comment dummy",
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
        let commentCount = 1;
        return commentCount;
      }
    };
    const doc2 = {
      id: "randy101"
    };

    const dbDocStub = sinon.stub(db, "doc").withArgs("/posts/:postId");
    const dbCollStub = sinon.stub(db, "collection");
    const docDataStub = sinon.stub(doc1, "data");
    const updateParam = { commentCount: docDataStub };
    const getStub = sinon.stub();
    const addStub = sinon.stub();

    dbDocStub.returns({ get: getStub });
    getStub.returns(Promise.resolve(doc1));
    updateStub.withArgs(updateParam).returns(Promise.resolve());
    docDataStub.returns({ commentCount: 0 });
    dbCollStub.withArgs("comments").returns({ add: addStub });
    addStub.withArgs("new dummy comment").returns(Promise.resolve(doc2));

    request(myFunctions.api)
      .post("/post/:postId/comment")
      .send(req)
      .query({ val: "Test1" })
      .set("Accept", "application/json")
      .expect("Content-Type", /json/)
      .expect(200)
      .expect(function(res) {
        res.body.body = "this is a comment dummy";
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
  it("responds with status 404 and json Post Not Found", function(done) {
    const req = {
      body: "this is a comment dummy",
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
        let commentCount = 1;
        return commentCount;
      }
    };
    const doc2 = {
      id: "randy101"
    };

    const dbDocStub = sinon.stub(db, "doc").withArgs("/posts/:postId");
    const dbCollStub = sinon.stub(db, "collection");
    const updateParam = { commentCount: 1 };
    const getStub = sinon.stub();
    const addStub = sinon.stub();

    dbDocStub.returns({ get: getStub });
    getStub.returns(Promise.resolve(doc1));
    updateStub.withArgs(updateParam).returns(Promise.resolve());
    dbCollStub.withArgs("comments").returns({ add: addStub });
    addStub.withArgs("new dummy comment").returns(Promise.resolve(doc2));

    request(myFunctions.api)
      .post("/post/:postId/comment")
      .send(req)
      .query({ val: "Test1" })
      .set("Accept", "application/json")
      .expect("Content-Type", /json/)
      .expect(404)
      .expect(function(res) {
        res.body.error = "Post not found";
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
  it("responds with status 400 and json , Must not be empty", function(done) {
    const req = {
      body: "",
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
        let commentCount = 1;
        return commentCount;
      }
    };
    const doc2 = {
      id: "randy101"
    };

    const dbDocStub = sinon.stub(db, "doc").withArgs("/posts/:postId");
    const dbCollStub = sinon.stub(db, "collection");
    const updateParam = { commentCount: 1 };
    const getStub = sinon.stub();
    const addStub = sinon.stub();

    dbDocStub.returns({ get: getStub });
    getStub.returns(Promise.resolve(doc1));
    updateStub.withArgs(updateParam).returns(Promise.resolve());
    dbCollStub.withArgs("comments").returns({ add: addStub });
    addStub.withArgs("new dummy comment").returns(Promise.resolve(doc2));

    request(myFunctions.api)
      .post("/post/:postId/comment")
      .send(req)
      .query({ val: "Test1" })
      .set("Accept", "application/json")
      .expect("Content-Type", /json/)
      .expect(400)
      .expect(function(res) {
        res.body.comment = "Must not be empty";
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
  it("responds with status 500 and json", function(done) {
    const req = {
      body: "this is a comment dummy",
      user: {
        username: "randy101",
        postId: "bleh101",
        imageUrl: "www.randy.com"
      }
    };
    const updateStub = sinon.stub();
    const doc2 = {
      id: "randy101"
    };

    const dbDocStub = sinon.stub(db, "doc").withArgs("/posts/:postId");
    const dbCollStub = sinon.stub(db, "collection");
    const getStub = sinon.stub();
    const error1 = "Something really bad happened";
    const addStub = sinon.stub();
    const updateParam = { commentCount: 1 };

    dbDocStub.returns({ get: getStub });
    getStub.returns(Promise.reject(error1));
    updateStub.withArgs(updateParam).returns(Promise.resolve());
    dbCollStub.withArgs("comments").returns({ add: addStub });
    addStub.withArgs("new dummy comment").returns(Promise.resolve(doc2));

    request(myFunctions.api)
      .post("/post/:postId/comment")
      .send(req)
      .query({ val: "Test1" })
      .set("Accept", "application/json")
      .expect("Content-Type", /json/)
      .expect(500)
      .then(res => {
        expect(res.body.error).to.equal("Something went wrong");
        done();
      })
      .catch(err => {
        expect(err).to.be.undefined;
        done(err);
      });
  });
});
