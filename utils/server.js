const express = require('express');
const multer = require('multer');
const cors = require('cors');
const fs = require('fs');
const { v4: uuidv4 } = require('uuid');  // Import UUID

const app = express();
app.use(cors());

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/');
  },
  filename: function (req, file, cb) {
    const uniqueId = uuidv4();  // Generate unique ID
    const fileName = `${uniqueId}-${file.originalname}`;  // Append original file name
    cb(null, fileName);
  },
});

const upload = multer({ storage: storage });

app.post('/upload', upload.single('file'), (req, res) => {
  try {
    const { spawn } = require('child_process');
    const medianFiltering = spawn('python', ['filter.py']);
    
    let outputData = '';
    let responseSent = false;

    medianFiltering.stdout.on('data', function (data) {
      outputData += data.toString();  // Accumulate the data
    });

    medianFiltering.stdout.on('end', function () {
      if (!responseSent) {
        responseSent = true;
        res.json({ message: outputData, fileId: req.file.filename });  // Include file ID in response
      }
    });

    medianFiltering.stderr.on('data', function (data) {
      console.error(`stderr: ${data}`);
    });

    medianFiltering.on('error', function (error) {
      console.error(`Error spawning child process: ${error}`);
      if (!responseSent) {
        responseSent = true;
        res.status(500).json({ error: 'Internal server error' });
      }
    });

    medianFiltering.on('close', function (code) {
      if (code !== 0 && !responseSent) {
        responseSent = true;
        res.status(500).json({ error: `Process exited with code ${code}` });
      }
    });
  } catch (err) {
    res.status(500).json({ error: `${err}` });
  }
});

app.listen(5000, () => {
  fs.mkdir("uploads", { recursive: true }, (err) => {
    if (err) {
      console.error("Failed to create directory:", err);
    } else {
      console.log("Directory created successfully.");
    }
  });
  console.log('Server is running on http://localhost:5000');
});

// Modify the route to load the track by unique ID
app.get('/load-track', (req, res) => {
  try {
    const fileId = req.query.fileId;  // Use fileId instead of index
    const { spawn } = require('child_process');
    const medianFiltering = spawn('python', ['filter.py', fileId]);

    let outputData = [];
    let responseSent = false;

    medianFiltering.stdout.on('data', function (data) {
      outputData.push(data);
    });

    medianFiltering.stdout.on('end', function () {
      if (!responseSent) {
        let outputString = Buffer.concat(outputData).toString('utf8');
        res.json({ message: outputString });
      }
    });

    medianFiltering.stderr.on('data', function (data) {
      console.error(`stderr: ${data}`);
    });

    medianFiltering.on('error', function (error) {
      console.error(`Error spawning child process: ${error}`);
      if (!responseSent) {
        responseSent = true;
        res.status(500).json({ error: 'Internal server error' });
      }
    });

    medianFiltering.on('close', function (code) {
      if (code !== 0 && !responseSent) {
        res.status(500).json({ error: `Process exited with code ${code}` });
      }
    });
  } catch (err) {
    res.status(500).json({ error: 'Server error occurred' });
  }
});

app.get('/see-uploads', (req, res) => {
  fs.readdir('uploads', (err, files) => {
    if (err) {
      return res.status(500).json({ message: "Error reading uploads directory" });
    }
    res.json({ message: files });
  });
});
