import os, sys
import numpy as np
from scipy import signal
import matplotlib.pyplot as plt
import IPython.display as ipd
import librosa.display
import soundfile as sf
sys.path.append('..')
import libfmp.b





def hps(x, Fs, N, H, L_h, L_p, L_unit='physical', mask='binary', eps=0.001, detail=False):
    """Harmonic-percussive separation (HPS) algorithm

    Notebook: C8/C8S1_HPS.ipynb

    Args:
        x (np.ndarray): Input signal
        Fs (scalar): Sampling rate of x
        N (int): Frame length
        H (int): Hopsize
        L_h (float): Horizontal median filter length given in seconds or frames
        L_p (float): Percussive median filter length given in Hertz or bins
        L_unit (str): Adjusts unit, either 'pyhsical' or 'indices' (Default value = 'physical')
        mask (str): Either 'binary' or 'soft' (Default value = 'binary')
        eps (float): Parameter used in soft maskig (Default value = 0.001)
        detail (bool): Returns detailed information (Default value = False)

    Returns:
        x_h (np.ndarray): Harmonic signal
        x_p (np.ndarray): Percussive signal
        details (dict): Dictionary containing detailed information; returned if ``detail=True``
    """
    assert L_unit in ['physical', 'indices']
    assert mask in ['binary', 'soft']
    # stft
    X = librosa.stft(x, n_fft=N, hop_length=H, win_length=N, window='hann', center=True, pad_mode='constant')
    # power spectrogram
    Y = np.abs(X) ** 2
    # median filtering
    if L_unit == 'physical':
        L_h = convert_l_sec_to_frames(L_h_sec=L_h, Fs=Fs, N=N, H=H)
        L_p = convert_l_hertz_to_bins(L_p_Hz=L_p, Fs=Fs, N=N, H=H)
    L_h = make_integer_odd(L_h)
    L_p = make_integer_odd(L_p)
    Y_h = signal.medfilt(Y, [1, L_h])
    Y_p = signal.medfilt(Y, [L_p, 1])

    # masking
    if mask == 'binary':
        M_h = np.int8(Y_h >= Y_p)
        M_p = np.int8(Y_h < Y_p)
    if mask == 'soft':
        eps = 0.00001
        M_h = (Y_h + eps / 2) / (Y_h + Y_p + eps)
        M_p = (Y_p + eps / 2) / (Y_h + Y_p + eps)
    X_h = X * M_h
    X_p = X * M_p

    # istft
    x_h = librosa.istft(X_h, hop_length=H, win_length=N, window='hann', center=True, length=x.size)
    x_p = librosa.istft(X_p, hop_length=H, win_length=N, window='hann', center=True, length=x.size)

    if detail:
        return x_h, x_p, dict(Y_h=Y_h, Y_p=Y_p, M_h=M_h, M_p=M_p, X_h=X_h, X_p=X_p)
    else:
        return x_h, x_p

def convert_l_sec_to_frames(L_h_sec, Fs=22050, N=1024, H=512):
    """Convert filter length parameter from seconds to frame indices

    Notebook: C8/C8S1_HPS.ipynb

    Args:
        L_h_sec (float): Filter length (in seconds)
        Fs (scalar): Sample rate (Default value = 22050)
        N (int): Window size (Default value = 1024)
        H (int): Hop size (Default value = 512)

    Returns:
        L_h (int): Filter length (in samples)
    """
    L_h = int(np.ceil(L_h_sec * Fs / H))
    return L_h


def convert_l_hertz_to_bins(L_p_Hz, Fs=22050, N=1024, H=512):
    """Convert filter length parameter from Hertz to frequency bins

    Notebook: C8/C8S1_HPS.ipynb

    Args:
        L_p_Hz (float): Filter length (in Hertz)
        Fs (scalar): Sample rate (Default value = 22050)
        N (int): Window size (Default value = 1024)
        H (int): Hop size (Default value = 512)

    Returns:
        L_p (int): Filter length (in frequency bins)
    """
    L_p = int(np.ceil(L_p_Hz * N / Fs))
    return L_p


def make_integer_odd(n):
    """Convert integer into odd integer

    Notebook: C8/C8S1_HPS.ipynb

    Args:
        n (int): Integer

    Returns:
        n (int): Odd integer
    """
    if n % 2 == 0:
        n += 1
    return n

Fs = 22050

# check command line arguments
if len(sys.argv) < 2:
    print("Usage: python script.py <fileID>")
    sys.exit(1)

fileID = sys.argv[1]

# Select the file 

#file_path = './uploads/' + fileID

inputVal = fileID

fn_wav = os.path.join('./uploads/'+inputVal)

x, Fs = librosa.load(fn_wav, sr=Fs, mono=True)


# inputVal = input()
# fn_wav = os.path.join('./uploads/'+inputVal+'.wav')
# x, Fs = librosa.load(fn_wav, sr=Fs, mono=True)
# N, H = 1024, 512
# X = librosa.stft(x, n_fft=N, hop_length=H, win_length=N, window='hann', center=True, pad_mode='constant')
# Y = np.abs(X)**2
# L_h = 23
# L_p = 9

x_h, x_p = hps(x, 22050, 1024, 512, 23, 9, 'indices', 'binary', 0.001, False)



output_fn = os.path.join('./output/x_h_'+inputVal+'.wav')
sf.write(output_fn, x_h, Fs)
output_fn = os.path.join('./output/x_p_'+inputVal+'.wav')
sf.write(output_fn, x_p, Fs)



