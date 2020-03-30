const { db, admin } = require("../util/admin");
const r = require("dotenv").config();

const sinon = require("sinon");
const { assert } = require("chai");
const request = require("supertest");

describe("POST /user/:signedInAs/unfollowing/:username unfollowUser", function() {
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
    const adminStub = sinon.stub(admin.firestore.FieldValue, "delete");
    const updateParam1 = {
      ":username": adminStub
    };
    const updateParam2 = {
      merge: true
    };
    const doc1 = {
      exists: true
    };
    const doc2 = {
      exists: true
    };
    const docStub1 = sinon.stub();
    const docStub2 = sinon.stub();
    const getStub1 = sinon.stub();
    const getStub2 = sinon.stub();
    const updateStub1 = sinon.stub();
    const updateStub2 = sinon.stub();

    const dbCollStub = sinon.stub(db, "collection");
    dbCollStub
      .withArgs("following")
      .onFirstCall()
      .returns({ doc: docStub1 });
    docStub1.withArgs(":signedInAs").returns({ get: getStub1 });
    getStub1.returns(Promise.resolve(doc1));
    dbCollStub
      .withArgs("following")
      .onSecondCall()
      .returns({ update: updateStub1 });
    updateStub1.withArgs(updateParam1).returns("heloo there 2");
    dbCollStub
      .withArgs("followers")
      .onFirstCall()
      .returns({ doc: docStub2 });
    docStub2.withArgs(":username").returns({ get: getStub2 });
    getStub2.returns(Promise.resolve(doc2));
    dbCollStub
      .withArgs("followers")
      .onSecondCall()
      .returns({ update: updateStub2 });
    updateStub2.withArgs({ ":signedInAs": adminStub }).returns("heloo there 3");

    request(myFunctions.api)
      .post("/user/:signedInAs/unfollowing/:username")
      .send(req)
      .set("Accept", "application/json")
      .expect("Content-Type", /json/)
      .expect(200)
      .end(function(err, res) {
        if (err) return done(err);
        assert(res.body.message == "Unfollowed user successfully");
        done();
      });
  });
});
