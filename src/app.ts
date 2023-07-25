import express, { Request, Response } from 'express';
import multer from 'multer';
import path from 'path';
import fs from "fs";
import dicomParser from "dicom-parser";

const app = express();
const upload = multer({ dest: 'uploads/' });

app.post('/api/upload', upload.single('file'), (req: Request, res: Response) => {
  res.status(201).json({ fileId: req?.file?.filename });
});


// dicomTag is a string 8 digits, https://www.dicomlibrary.com/dicom/dicom-tags/
// 00100010 Patient's Name
// 00100020	Patient ID
// 00200013	Instance Number
app.get('/api/dicom', (req: Request, res: Response) => {
  const fileId= req.query.fileId as string;
  const dicomTag = req.query.dicomTag as string;
  const filePath = path.join(__dirname, '../uploads', fileId);
  fs.readFile(filePath, (err, data) => {
    if (err) {
      res.status(500).send('error reading file');
      return; 
    }

    const dataSet = dicomParser.parseDicom(data);
    const attribute = dataSet.string('x'+dicomTag);

    res.status(200).json({ dicomTag: dicomTag, value: attribute });
  });
});

export default app