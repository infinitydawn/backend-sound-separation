const { spawn } = require('child_process');

function processFile(fileId, callback) {
  try {
    let sampleRate = 22050;
    let windowSize = 1024;
    let hopLength = 512;
    let horizFilter = 27;
    let vertFilter = 1;
    let L_unit = "indices";
    let mask = "binary";
    eps = 0.001;
    detail = "False";

    console.log("fileID before running python: "+fileId)
    const medianFiltering = spawn('python', ['hpss.py', fileId, sampleRate, windowSize, hopLength, horizFilter, vertFilter, L_unit, mask, eps, detail]);
    let outputData = '';
    let errorOccurred = false;

    medianFiltering.stdout.on('data', (data) => {
      outputData += data.toString();
    });

    medianFiltering.stdout.on('end', () => {
      if (!errorOccurred) {
        callback(null, outputData);  // Pass the processed data back via callback
      }
    });

    medianFiltering.stderr.on('data', (data) => {
      console.error(`stderr: ${data}`);
      errorOccurred = true;
    });

    medianFiltering.on('error', (error) => {
      console.error(`Error spawning child process: ${error}`);
      callback(new Error('Internal server error'));
    });

    medianFiltering.on('close', (code) => {
      if (code !== 0 && !errorOccurred) {
        callback(new Error(`Process exited with code ${code}`));
      }
    });
  } catch (err) {
    callback(err);
  }
}

module.exports = processFile;