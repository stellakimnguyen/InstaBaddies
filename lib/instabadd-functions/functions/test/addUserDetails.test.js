const { db } = require("../util/admin");
require("dotenv").config();

const sinon = require("sinon");
const { assert } = require("chai");
const request = require("supertest");

describe("POST /user addUserDetails", function() {
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
    const updateStub = sinon.stub();
    const dbDocStub = sinon
      .stub(db, "doc")
      .withArgs(`/users/${req.user.username}`);
    const userDetails = {
      bio: "this is a bio dummy",
      website: "http://myDummyWebsite.com"
    };

    dbDocStub.returns({ update: updateStub });
    updateStub.withArgs(userDetails).returns(Promise.resolve());

    request(myFunctions.api)
      .post("/user")
      .send(req)
      .set("Accept", "application/json")
      .expect("Content-Type", /json/)
      .expect(200)
      .end(function(err, res) {
        if (err) return done(err);
        assert(res.body.message == "Details added successfully");
        done();
      });
  });
  it("responds with status 500 and json", function(done) {
    const req = {
      bio: "this is a bio dummy",
      website: "http://myDummyWebsite.com",
      user: {
        username: "randy101"
      }
    };
    const updateStub = sinon.stub();
    const dbDocStub = sinon
      .stub(db, "doc")
      .withArgs(`/users/${req.user.username}`);
    const userDetails = {
      bio: "this is a bio dummy",
      website: "http://myDummyWebsite.com"
    };
    const error1 = "Something really bad happened";

    dbDocStub.returns({ update: updateStub });
    updateStub.withArgs(userDetails).returns(Promise.reject(error1));

    request(myFunctions.api)
      .post("/user")
      .send(req)
      .set("Accept", "application/json")
      .expect("Content-Type", /json/)
      .expect(500)
      .then(() => {
        // res
        done();
      })
      .catch(err => {
        done(err);
      });
  });
});
