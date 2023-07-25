import express, { Request, Response } from 'express';
import multer from 'multer';
import path from 'path';
import fs from "fs";
import dicomParser from "dicom-parser";
import sharp from 'sharp';
import daikon from 'daikon';

const app = express();

// TODO: store files in AWS, currently files are store under uploads folder locally
const upload = multer({ dest: 'uploads/' });

app.post('/api/upload', upload.single('file'), (req: Request, res: Response) => {
  res.status(201).json({ fileId: req?.file?.filename });
});


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

// TODO: support image resizing api based on query parameters
app.get('/api/dicom/image', (req: Request, res: Response) => {
  const fileId= req.query.fileId as string;
  const filePath = path.join(__dirname, '../uploads', fileId);
  fs.readFile(filePath, (err, data) => {
    if (err) {
      res.status(500).send('error reading file');
      return; 
    }

    const dicom = daikon.Series.parseImage(new DataView(data.buffer))
    const dicomBuffer = Buffer.from(dicom.getRawData())
   
    // solution: https://github.com/lovell/sharp/issues/1640
    const downscaledBuffer = Buffer.alloc(dicomBuffer.length / 2);
    for (let i = 0; i < downscaledBuffer.length; i++) {
      const value = dicomBuffer.readUInt16LE(i * 2);
      downscaledBuffer[i] = value >> 8; 
    }

    // TODO: store files in AWS, currently files are store under assets folder locally
    const outputImagePath = path.join(__dirname, '../assets/' + fileId + '.png');
    sharp(downscaledBuffer, {
      raw: {
        width: dicom.getCols(),
        height: dicom.getRows(),
        channels: dicom.getNumberOfSamplesPerPixel()
      }
    })
    .png()
    .toFile(`${outputImagePath}`)
    .then(() => { res.status(200).send({ imagePath: outputImagePath }); })
    .catch((err) => { 
      console.error(err)
      res.status(500).send('error generating png');
    });
    
  });
});


export default app