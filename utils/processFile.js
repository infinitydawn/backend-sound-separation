const { spawn } = require('child_process');

function processFile(fileId, callback) {
  try {
    const medianFiltering = spawn('python', ['filter.py', fileId]);
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
