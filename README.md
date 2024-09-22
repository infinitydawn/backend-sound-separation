
# Audio Processing Server

## Overview

This server application is built with Node.js and handles audio file uploads, processing using a Python script, and tracks management. It allows users to upload audio files, processes them to remove or filter content, and lists all uploaded tracks.

## Features

- **File Upload**: Upload audio files to the server.
- **Audio Processing**: Automatically processes audio files using a Python script.
- **List Uploads**: Displays all uploaded audio files.

## Installation

Before you can run the server, you need to set it up on your local machine.

### Prerequisites

- Node.js: The server runtime environment. [Download Node.js](https://nodejs.org/)
- npm: Comes with Node.js and will handle package management.
- Python: Required for running the audio processing script. [Download Python](https://www.python.org/downloads/)

### Setup Steps

1. **Clone the repository**:
   Open a terminal and run the following command:
   ```bash
   git clone https://your-repository-url
   cd your-project-directory
   ```

2. **Install Node.js dependencies**:
   In the same terminal, run:
   ```bash
   npm install
   ```

3. **Start the server**:
   Still in the terminal, start the server with:
   ```bash
   npm start
   ```
   This will launch the server on `http://localhost:5000`.

## Usage

### Uploading an Audio File

- Visit `http://localhost:5000` in your web browser.
- Use the file upload section to upload new audio files.

### Processing Audio

- The server automatically processes any uploaded audio using a Python script, which can be modified to adjust the processing logic.

### Viewing Uploaded Files

- Navigate to the "See Uploads" section on the server's homepage to view and manage uploaded files.

## Python Script Details

The included Python script `filter.py` handles the detailed processing of audio files. It checks command-line arguments, loads audio files based on the provided index, and outputs processed audio data.

### Running the Script Manually

To run the script manually for testing:
```bash
python filter.py <audioIndex>
```
Make sure to replace `<audioIndex>` with the index number of the audio file in the uploads directory.


