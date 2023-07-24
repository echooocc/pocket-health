import express from 'express';
import multer from 'multer';

const app = express();
const upload = multer({ dest: 'uploads/' });

// endpoint upload dicom file
app.post('/api/upload', upload.single('file'), (req, res) => {

  console.log('this ran');
  res.status(200).json({ fileId: req?.file?.filename });
});


app.listen(3000, () => console.log('Server listening on port 3000'));
