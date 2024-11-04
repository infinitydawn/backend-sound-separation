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
    # Get file properties
    total_frames = wav_file.getnframes()
    num_channels = wav_file.getnchannels()
    sample_width = wav_file.getsampwidth()
    
    # Decide on frames to read, or set it to the total frames
    num_samples_to_read = min(147008, total_frames)  # Read up to 147008 or the total frames, whichever is smaller
    
    frames = wav_file.readframes(num_samples_to_read)

    # Dynamically handle based on sample width
    if sample_width == 2:
        data_type = 'h'  # 16-bit PCM
        fmt = f"<{num_samples_to_read * num_channels}{data_type}"
        samples = struct.unpack(fmt, frames)

    elif sample_width == 1:
        data_type = 'B'  # 8-bit PCM
        fmt = f"<{num_samples_to_read * num_channels}{data_type}"
        samples = struct.unpack(fmt, frames)

    elif sample_width == 3:
        # 24-bit PCM: Manually convert 3 bytes to integer values
        samples = []
        for i in range(0, len(frames), 3):
            # Read 3 bytes at a time
            byte_chunk = frames[i:i+3]
            # Convert to signed 24-bit integer
            sample = int.from_bytes(byte_chunk, byteorder='little', signed=True)
            samples.append(sample)

    else:
        raise ValueError(f"Unsupported sample width: {sample_width}")

    # Print the samples or handle them as needed
    print(samples)
