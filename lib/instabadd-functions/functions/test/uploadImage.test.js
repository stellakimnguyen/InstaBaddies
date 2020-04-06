const { db, admin } = require("../util/admin");
const r = require("dotenv").config();

const sinon = require("sinon");
const { assert } = require("chai");
const request = require("supertest");
const Busboy = require("busboy");

describe("POST /user/image uploadImage", function() {
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
    const imageToBeUploaded = {
      filepath: ""
    };
    const uploadParam2 = {
      resumable: false,
      metadata: {
        metadata: {
          contentType: "image/jpeg"
        }
      }
    };
    const url = "www.randyRules.com";
    const busboyParam2 = () => {};
    const busboy = new Busboy({ headers: req.headers });
    const bucketStub = sinon.stub();
    const uploadStub = sinon.stub();
    const updateStub = sinon.stub();

    const busboyStub = sinon.stub(busboy, "on");
    const adminStorageStub = sinon.stub(admin, "storage");
    const dbDocStub = sinon.stub(db, "doc");
    busboyStub.withArgs("finish", busboyParam2);
    adminStorageStub.returns({ bucket: bucketStub });
    bucketStub.returns({ upload: uploadStub });
    uploadStub.withArgs(imageToBeUploaded.filepath, uploadParam2);

    dbDocStub.withArgs(`/users/randy101`).returns({ update: updateStub });
    updateStub.withArgs({ imageUrl: url }).returns(Promise.resolve());
    request(myFunctions.api)
      .post("/user/image")
      .send("i a string")
      .expect("Content-Type", /json/)
      .set(
        "Content-Type",
        "multipart/form-data; boundary=--------------------------627585108249114544468217"
      )
      .expect(200)
      .end(function(err, res) {
        if (err) return done(err);
        assert(res.body.message == "Image uploaded successfully");
        done();
      });
  });
});
