const { db, admin } = require("../util/admin");
const r = require("dotenv").config();

const sinon = require("sinon");
const { assert } = require("chai");
const request = require("supertest");

describe("DELETE /post/:postId deletePost", function() {
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
      bio: "this is a bio dummy",
      website: "http://myDummyWebsite.com",
      user: {
        username: "randy101"
      },
      headers: {
        "content-type":
          "multipart/form-data; boundary=--------------------------627585108249114544468217"
      }
    };
    const doc = {
      exists: true,
      id: "rayndRules101",
      data: () => {
        let username = "randy101";
        return username;
      }
    };
    const getStub = sinon.stub();
    const deleteStub = sinon.stub();
    const dbDocStub = sinon.stub(db, "doc");
    const docDataStub = sinon.stub(doc, "data");

    dbDocStub
      .withArgs(`/posts/:postId`)
      .onCall(0)
      .returns({ get: getStub });
    getStub.returns(Promise.resolve(doc));
    docDataStub.returns({ username: "randy101" });
    dbDocStub.onCall(1).returns({ delete: deleteStub });
    deleteStub.returns(Promise.resolve());

    request(myFunctions.api)
      .delete("/post/:postId")
      .send(req)
      .expect("Content-Type", /json/)
      .expect(200)
      .end(function(err, res) {
        if (err) return done(err);
        assert(res.body.message == "Post deleted Successfully");
        done();
      });
  });
  it("responds with status 403 and json, Unauthorized", function(done) {
    const req = {
      bio: "this is a bio dummy",
      website: "http://myDummyWebsite.com",
      user: {
        username: "randy101"
      },
      headers: {
        "content-type":
          "multipart/form-data; boundary=--------------------------627585108249114544468217"
      }
    };
    const doc = {
      exists: true,
      id: "rayndRules101",
      data: () => {
        let username = "randy101";
        return username;
      }
    };
    const getStub = sinon.stub();
    const deleteStub = sinon.stub();
    const dbDocStub = sinon.stub(db, "doc");
    const docDataStub = sinon.stub(doc, "data");

    dbDocStub
      .withArgs(`/posts/:postId`)
      .onCall(0)
      .returns({ get: getStub });
    getStub.returns(Promise.resolve(doc));
    docDataStub.returns({ username: "randy102" });
    dbDocStub.onCall(1).returns({ delete: deleteStub });
    deleteStub.returns(Promise.resolve());

    request(myFunctions.api)
      .delete("/post/:postId")
      .send(req)
      .expect("Content-Type", /json/)
      .expect(403)
      .end(function(err, res) {
        if (err) return done(err);
        assert(res.body.error == "Unauthorized");
        done();
      });
  });
  it("responds with status 404 and json, Post not found", function(done) {
    const req = {
      bio: "this is a bio dummy",
      website: "http://myDummyWebsite.com",
      user: {
        username: "randy101"
      },
      headers: {
        "content-type":
          "multipart/form-data; boundary=--------------------------627585108249114544468217"
      }
    };
    const doc = {
      exists: false,
      id: "rayndRules101",
      data: () => {
        let username = "randy101";
        return username;
      }
    };
    const getStub = sinon.stub();
    const deleteStub = sinon.stub();
    const dbDocStub = sinon.stub(db, "doc");
    const docDataStub = sinon.stub(doc, "data");

    dbDocStub
      .withArgs(`/posts/:postId`)
      .onCall(0)
      .returns({ get: getStub });
    getStub.returns(Promise.resolve(doc));
    docDataStub.returns({ username: "randy101" });
    dbDocStub.onCall(1).returns({ delete: deleteStub });
    deleteStub.returns(Promise.resolve());

    request(myFunctions.api)
      .delete("/post/:postId")
      .send(req)
      .expect("Content-Type", /json/)
      .expect(404)
      .end(function(err, res) {
        if (err) return done(err);
        assert(res.body.error == "Post not found");
        done();
      });
  });
});
