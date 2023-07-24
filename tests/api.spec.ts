import request from 'supertest';
import app from "../src/app";

describe('dicom api tests', () => {
  test("/api/upload", (done) => {
    request(app).post("/api/upload")
    .attach('file', `${__dirname}/mock/IM000002`)
    .expect(201)
    .expect((res) => {
      res.body.fileId.length !== 0
    })
    .end((err) => {
      if (err) return done(err);
      return done();
    });
});
});