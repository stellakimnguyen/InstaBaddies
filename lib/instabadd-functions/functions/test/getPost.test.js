const { db } = require("../util/admin");
const r = require("dotenv").config();

const sinon = require("sinon");
const { assert, expect } = require("chai");
const request = require("supertest");

describe("GET /post/:postId getPost", function() {
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
      }
    };
    const doc1 = {
      snap: "hi 1",
      exists: true,
      data: () => {
        let postId = ":postId";
        return postId;
      },
      id: "randyrules101"
    };
    const doc2 = [];
    const whereStub = sinon.stub();
    const orderByStub = sinon.stub();
    const getStub1 = sinon.stub();
    const getStub2 = sinon.stub();

    const dbCollStub = sinon.stub(db, "collection");
    const dbDocStub = sinon.stub(db, "doc");
    dbDocStub.withArgs("/posts/:postId").returns({ get: getStub1 });
    getStub1.returns(Promise.resolve(doc1));
    dbCollStub.withArgs("comments").returns({ orderBy: orderByStub });
    orderByStub.withArgs("createdAt", "desc").returns({ where: whereStub });
    whereStub.withArgs("postId", "==", ":postId").returns({ get: getStub2 });
    getStub2.returns(Promise.resolve(doc2));

    request(myFunctions.api)
      .get("/post/:postId")
      .send(req)
      .set("Accept", "application/json")
      .expect("Content-Type", /json/)
      .expect(200)
      .end(function(err, res) {
        if (err) return done(err);
        assert(res.body == ":postId");
        done();
      });
  });
  it("responds with status 404 and json", function(done) {
    const req = {
      bio: "this is a bio dummy",
      website: "http://myDummyWebsite.com",
      user: {
        username: "randy101"
      }
    };
    const doc1 = {
      exists: false,
      data: () => {
        let postId = ":postId";
        return postId;
      },
      id: "randyrules101"
    };
    const doc2 = [];
    const whereStub = sinon.stub();
    const orderByStub = sinon.stub();
    const getStub1 = sinon.stub();
    const getStub2 = sinon.stub();

    const dbCollStub = sinon.stub(db, "collection");
    const dbDocStub = sinon.stub(db, "doc");
    dbDocStub.withArgs("/posts/:postId").returns({ get: getStub1 });
    getStub1.returns(Promise.resolve(doc1));
    dbCollStub.withArgs("comments").returns({ orderBy: orderByStub });
    orderByStub.withArgs("createdAt", "desc").returns({ where: whereStub });
    whereStub.withArgs("postId", "==", ":postId").returns({ get: getStub2 });
    getStub2.returns(Promise.resolve(doc2));

    request(myFunctions.api)
      .get("/post/:postId")
      .send(req)
      .set("Accept", "application/json")
      .expect("Content-Type", /json/)
      .expect(404)
      .end(function(err, res) {
        if (err) return done(err);
        assert(res.body.error == "Post not found");
        done();
      });
  });
});
