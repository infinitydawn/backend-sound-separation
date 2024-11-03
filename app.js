const express = require('express');
const cors = require('cors');
const fs = require('fs');
const uploadRoute = require('./routes/upload');
const loadTrackRoute = require('./routes/loadTrack');
const seeUploadsRoute = require('./routes/seeUploads');

const app = express();
app.use(cors());

// Use the routes
app.use('/upload', uploadRoute);
app.use('/load-track', loadTrackRoute);
app.use('/see-uploads', seeUploadsRoute);

app.listen(5000, () => {
  fs.mkdir('uploads', { recursive: true }, (err) => {
    if (err) {
      console.error("Failed to create directory:", err);
    } else {
      console.log("Directory created successfully.");
    }
  });
  console.log('Server is running on http://localhost:5000');
});
