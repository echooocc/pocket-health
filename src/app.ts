import express from 'express';
import multer from 'multer';
const app = express();
const upload = multer({ dest: 'uploads/' });

// endpoint upload dicom file
app.post('/api/upload', upload.single('file'), (req, res) => {
  res.status(201).json({ fileId: req?.file?.filename });
});

export default app