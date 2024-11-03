const express = require('express');
const router = express.Router();
const processFile = require('../utils/processFile');

router.get('/', (req, res) => {
  const fileId = req.query.fileId;
  processFile(fileId, res);
});

module.exports = router;
