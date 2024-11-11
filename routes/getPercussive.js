const express = require('express');
const path = require('path');
const fs = require('fs');

const router = express.Router();

router.get('/', (req, res) => {
  const { fileId } = req.query;

  if (!fileId) {
    return res.status(400).json({ error: 'Missing fileId query parameter' });
  }

  // Define the path to the percussive file
  const percussiveFilePath = path.join(__dirname, '../output', `/x_p_${fileId}.wav`);

  console.log(percussiveFilePath)

  // Check if the file exists
  fs.access(percussiveFilePath, fs.constants.F_OK, (err) => {
    if (err) {
      console.error(`Percussive file not found for fileId: ${fileId}`);
      return res.status(404).json({ error: 'Percussive file not found' });
    }

    // Send the file
    res.sendFile(percussiveFilePath, (err) => {
      if (err) {
        console.error('Error sending percussive file:', err);
        res.status(500).json({ error: 'Error sending percussive file' });
      }
    });
  });
});

module.exports = router;
