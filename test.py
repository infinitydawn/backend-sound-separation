import os
import wave
import struct
import sys

# Ensure that we have at least one command line argument
if len(sys.argv) < 2:
    print("Usage: python script.py <audioIndex>")
    sys.exit(1)

try:
    # Attempt to convert the second command line argument to an integer
    audioIndex = int(sys.argv[1])
except ValueError:
    # Handle the case where the conversion fails
    raise ValueError("Error: audioIndex must be an integer")

# List files in the 'uploads' directory
files = os.listdir('./uploads')
if audioIndex < 0 or audioIndex >= len(files):
    raise ValueError("Error: audioIndex is out of bounds")


# testing
# print("The number of files: ", len(files))
# print("The argv length: ", len(sys.argv))
# print("The index: ", audioIndex)
# print("List of files: ", files)

# Select the file and make a the file path
file_to_process = files[audioIndex]
file_path = './uploads/' + file_to_process

# Open the WAV file and read frames
with wave.open(file_path, 'r') as wav_file:
    num_samples_to_read = 147008
    frames = wav_file.readframes(num_samples_to_read)
    fmt = f"<{num_samples_to_read * wav_file.getnchannels()}{'h' if wav_file.getsampwidth() == 2 else 'B'}"
    samples = struct.unpack(fmt, frames)
    print(samples)
