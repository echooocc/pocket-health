import request from 'supertest';
import app from "../src/app";


describe('dicom api tests', () => {
  xtest("/api/upload", (done) => {
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

  const fileId = 'd751b79ae581e6c36569589db2358b8b';
  const dicomTagPatientName = '00100010';
  test(`/api/dicom by dicomTag=${dicomTagPatientName}`, async () => {
    const response = await request(app).get("/api/dicom/?fileId=" + fileId + "&dicomTag=" + dicomTagPatientName)
    .expect(200);
    expect(response.body.dicomTag).toBe(dicomTagPatientName);
    expect(response.body.value).toBe('NAYYAR^HARSH')
  });

  const dicomTagPatientId = '00100020';
  test(`/api/dicom by dicomTag=${dicomTagPatientId}`, async () => {
    const response = await request(app).get("/api/dicom/?fileId=" + fileId + "&dicomTag=" + dicomTagPatientId)
    .expect(200);
    expect(response.body.dicomTag).toBe(dicomTagPatientId);
    expect(response.body.value).toBe('5184')
  });
});