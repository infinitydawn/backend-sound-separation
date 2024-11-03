const { spawn } = require('child_process');

function processFile(fileId, res) {
  try {
    const medianFiltering = spawn('python', ['filter.py', fileId]);
    let outputData = '';
    let responseSent = false;

    medianFiltering.stdout.on('data', (data) => {
      outputData += data.toString();
    });

    medianFiltering.stdout.on('end', () => {
      if (!responseSent) {
        responseSent = true;
        res.json({ message: outputData, fileId });
      }
    });

    medianFiltering.stderr.on('data', (data) => {
      console.error(`stderr: ${data}`);
    });

    medianFiltering.on('error', (error) => {
      console.error(`Error spawning child process: ${error}`);
      if (!responseSent) {
        responseSent = true;
        res.status(500).json({ error: 'Internal server error' });
      }
    });

    medianFiltering.on('close', (code) => {
      if (code !== 0 && !responseSent) {
        res.status(500).json({ error: `Process exited with code ${code}` });
      }
    });
  } catch (err) {
    res.status(500).json({ error: `${err}` });
  }
}

module.exports = processFile;
