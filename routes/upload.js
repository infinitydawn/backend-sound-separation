const express = require('express');
const router = express.Router();
const multer = require('multer');
const storage = require('../config/multerConfig');  // Import multer storage configuration
const processFile = require('../utils/processFile');  // Import child process utility

const upload = multer({ storage: storage });

router.post('/', upload.single('file'), (req, res) => {
  const fileId = req.file.filename;
  processFile(fileId, res);
});

module.exports = router;
