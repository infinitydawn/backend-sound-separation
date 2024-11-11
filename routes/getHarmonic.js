const express = require('express');
const path = require('path');
const fs = require('fs');

const router = express.Router();

router.get('/', (req, res) => {
  const { fileId } = req.query;

  if (!fileId) {
    return res.status(400).json({ error: 'Missing fileId query parameter' });
  }

  // Define the path to the harmonic file
  const harmonicFilePath = path.join(__dirname, '../output', `/x_h_${fileId}.wav`);

  console.log(harmonicFilePath)

  // Check if the file exists
  fs.access(harmonicFilePath, fs.constants.F_OK, (err) => {
    if (err) {
      console.error(`Harmonic file not found for fileId: ${fileId}`);
      return res.status(404).json({ error: 'Harmonic file not found' });
    }

    // Send the file
    res.sendFile(harmonicFilePath, (err) => {
      if (err) {
        console.error('Error sending harmonic file:', err);
        res.status(500).json({ error: 'Error sending harmonic file' });
      }
    });
  });
});

module.exports = router;
