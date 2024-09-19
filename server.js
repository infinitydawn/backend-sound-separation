const express = require('express'); // server
const multer = require('multer'); // file management
const cors = require('cors'); // to test in browser
const fs = require('fs');

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
  const { spawn } = require('child_process');
  const medianFiltering = spawn('python', ['test.py']);

  let outputData = '';
  let responseSent = false;

  medianFiltering.stdout.on('data', function (data) {
    outputData += data.toString();  // Accumulate the data
  });

  medianFiltering.stdout.on('end', function () {
    if (!responseSent) {
      responseSent = true;
      res.json({ message: outputData });  // Send the response once all data is received
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
    if (code !== 0) {
      console.error(`Process exited with code: ${code}`);
      if (!responseSent) {
        responseSent = true;
        res.status(500).json({ error: `Process exited with code ${code}` });
      }
    }
  });

  // Handle file deletion asynchronously after response
  medianFiltering.on('exit', function() {
    fs.readdir('uploads', (err, files) => {
      if (err) {
        console.error(`Error reading uploads directory: ${err}`);
        return;
      }
      for (const file of files) {
        fs.unlink(`uploads/${file}`, err => {
          if (err) {
            console.error(`Error deleting file ${file}: ${err}`);
          } else {
            console.log(`Deleted file: ${file}`);
          }
        });
      }
    });
  });
});


app.listen(5000, () => {
  console.log('Server is running on http://localhost:5000');
});

app.get('/get-status', (req, res) => {
  const { spawn } = require('child_process');
  const medianFiltering = spawn('python', ['test.py']);

  let outputData = '';

  medianFiltering.stdout.on('data', function (data) {
    outputData += data.toString();  // Accumulate the data
  });

  medianFiltering.stdout.on('end', function () {
    res.json({ message: outputData });  // Send the response once all data is received
  });

  medianFiltering.stderr.on('data', function (data) {
    console.error(`stderr: ${data}`);
  });

  medianFiltering.on('error', function (error) {
    console.error(`Error spawning child process: ${error}`);
    res.status(500).json({ error: 'Internal server error' });
  });

  medianFiltering.on('close', function (code) {
    if (code !== 0) {
      console.error(`Process exited with code: ${code}`);
      res.status(500).json({ error: `Process exited with code ${code}` });
    }
  });
});

app.get('/see-uploads', (req, res) => {
  fs.readdir("uploads", (err, files) => {
    if (err) {
      return res.json({ message: "error occured: " + err });
    }

    let filesList = ''

    files.forEach(file => {
      filesList += `${file}\n`
    })

    res.json({
      message: filesList
    })

  })
})
