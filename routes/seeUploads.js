const express = require('express');
const router = express.Router();
const fs = require('fs');

router.get('/', (req, res) => {
  fs.readdir('uploads', (err, files) => {
    if (err) {
      return res.status(500).json({ message: "Error reading uploads directory" });
    }
    res.json({ message: files });
  });
});

module.exports = router;
