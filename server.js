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

  try {
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
    // medianFiltering.on('exit', function () {
    //   fs.readdir('uploads', (err, files) => {
    //     if (err) {
    //       console.error(`Error reading uploads directory: ${err}`);
    //       return;
    //     }
    //     for (const file of files) {
    //       fs.unlink(`uploads/${file}`, err => {
    //         if (err) {
    //           console.error(`Error deleting file ${file}: ${err}`);
    //         } else {
    //           console.log(`Deleted file: ${file}`);
    //         }
    //       });
    //     }
    //   });
    // });
  } catch (err) {
    res.status(500).json({ error: `${err}` });
  }
});


app.listen(5000, () => {
  fs.mkdir("uploads");
  console.log('Server is running on http://localhost:5000');
});

app.get('/load-track', (req, res) => {
  try {
      const audioIndex = req.query.audioIndex;
      const { spawn } = require('child_process');
      const medianFiltering = spawn('python', ['test.py', audioIndex]);

      let outputData = [];
      // fixing the responses issue
      let responseSent = false; 

      medianFiltering.stdout.on('data', function (data) {
          outputData.push(data);  
      });

      medianFiltering.stdout.on('end', function () {
          if (!responseSent) {
              let outputString = Buffer.concat(outputData).toString('utf8');
              responseSent = true;
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
              res.status(500).json({ error: 'Internal server error caused by Python script' });
          }
      });

      medianFiltering.on('close', function (code) {
          if (code !== 0 && !responseSent) {
              console.error(`Process exited with code: ${code}`);
              responseSent = true;
              res.status(500).json({ error: `Process exited with non-zero code ${code}` });
          }
      });
  } catch (err) {
      console.error('Server error:', err);
      if (!res.headersSent) {
          res.status(500).json({ error: 'Server error occurred' });
      }
  }
});

app.get('/see-uploads', (req, res) => {
  fs.readdir('uploads', (err, files) => {
    if (err) {
      console.error("Error reading uploads directory: ", err);
      return res.status(500).json({ message: "Error reading uploads directory" });
    }

    // let filesList = files.join('\n'); // Concatenate filenames with newlines

    res.json({ message: files });
  });
});

