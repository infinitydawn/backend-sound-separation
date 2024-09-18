const express = require('express'); // server
const multer = require('multer'); // file management
const cors = require('cors'); // to test in browser

const app = express();
app.use(cors());

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/');
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + '-' + file.originalname);
  },
});

const upload = multer({ storage: storage });

app.post('/upload', upload.single('file'), (req, res) => {
  res.json({ message: 'File uploaded successfully!' });
});

app.listen(5000, () => {
  console.log('Server is running on http://localhost:5000');
});

app.get('/get-status', (req, res) => {
  const { spawn } = require('child_process');
  const medianFiltering = spawn('python', ['test.py']);

  let outputData = '';

  medianFiltering.stdout.on('data', function(data) {
    outputData += data.toString();  // Accumulate the data
  });

  medianFiltering.stdout.on('end', function() {
    res.json({ message: outputData });  // Send the response once all data is received
  });

  medianFiltering.stderr.on('data', function(data) {
    console.error(`stderr: ${data}`);
  });

  medianFiltering.on('error', function(error) {
    console.error(`Error spawning child process: ${error}`);
    res.status(500).json({ error: 'Internal server error' });
  });

  medianFiltering.on('close', function(code) {
    if (code !== 0) {
      console.error(`Process exited with code: ${code}`);
      res.status(500).json({ error: `Process exited with code ${code}` });
    }
  });
});


