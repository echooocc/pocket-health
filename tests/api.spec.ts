import request from 'supertest';
import app from "../src/app";
import path from 'path';

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

  const fileId = 'f39acf6ae1c3e2f2403dcb67ad58c4b6';
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

  const outputImagePath = path.join(__dirname, '../assets/' + fileId + '.png');
  test(`/api/dicom/image`, async () => {
    const response = await request(app).get("/api/dicom/image?fileId=" + fileId)
    .expect(200);
    expect(response.body.imagePath).toBe(outputImagePath);
  });
});