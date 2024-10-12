import os
import wave
import struct
import sys

# check command line arguments
if len(sys.argv) < 2:
    print("Usage: python script.py <audioIndex>")
    sys.exit(1)


#check the passed index
# try:
#     audioIndex = int(sys.argv[1])
# except ValueError:
#     raise ValueError("Error: audioIndex must be an integer")




# if audioIndex < 0 or audioIndex >= len(files):
#     raise ValueError("Error: audioIndex is out of bounds")
audioIndex = sys.argv[1]
# files = os.listdir('./uploads')

# testing
# print("The number of files: ", len(files))
# print("The argv length: ", len(sys.argv))
# print("The index: ", audioIndex)
# print("List of files: ", files)

# Select the file 

file_path = './uploads/' + audioIndex

# Open the WAV file and read frames
with wave.open(file_path, 'r') as wav_file:
    num_samples_to_read = 147008
    frames = wav_file.readframes(num_samples_to_read)
    fmt = f"<{num_samples_to_read * wav_file.getnchannels()}{'h' if wav_file.getsampwidth() == 2 else 'B'}"
    samples = struct.unpack(fmt, frames)
    print(samples)
