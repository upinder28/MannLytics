import librosa
import numpy as np

def analyze_voice(file_path):
    try:
        y, sr = librosa.load(file_path)
        mfcc = np.mean(librosa.feature.mfcc(y=y, sr=sr), axis=1)

        stress = "Normal"
        if np.mean(mfcc) < -200:
            stress = "High"

        return {
            "voice_stress": stress
        }

    except Exception as e:
        return {
            "voice_stress": "Error",
            "message": str(e)
        }