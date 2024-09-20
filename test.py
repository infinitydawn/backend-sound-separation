# import random
# import os

# files = os.listdir('./uploads')

# #random_number = random.randint(1, 10)
# #print(files[0])

# import wave
# import contextlib
# frames = ''
# rate = ''

# def get_wav_length(file_path):
#     with contextlib.closing(wave.open(file_path, 'r')) as f:
#         frames = f.getnframes()
#         rate = f.getframerate()
#         duration = frames / float(rate)
#         return [duration,frames,rate]

# file_path = './uploads/'+files[0]  # Replace with your WAV file path
# audioInfo = get_wav_length(file_path)
# print(f"Length of the WAV file: {audioInfo[0]} seconds\nNumber of frames: {audioInfo[1]}\nRate: {audioInfo[2]}")

import os
import wave
import struct

# Get the first file in the uploads directory
files = os.listdir('./uploads')
file_path = './uploads/' + files[1]

# Open the WAV file and read the first 100 samples
with wave.open(file_path, 'r') as wav_file:
    num_samples_to_read = 147008
    frames = wav_file.readframes(num_samples_to_read)
    fmt = f"<{num_samples_to_read * wav_file.getnchannels()}{'h' if wav_file.getsampwidth() == 2 else 'B'}"
    samples = struct.unpack(fmt, frames)
    print(samples)

