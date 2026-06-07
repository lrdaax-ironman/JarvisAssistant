import argparse
import os
import sys
import tempfile


DEFAULT_DURATION = 5
DEFAULT_SAMPLE_RATE = 16000
DEFAULT_MODEL = "base"
DEFAULT_LANGUAGE = "fr"


def write_error(message):
    print(message, file=sys.stderr, flush=True)


def parse_args():
    parser = argparse.ArgumentParser(description="Transcription vocale locale pour JARVIS.")
    parser.add_argument("--duration", type=float, default=DEFAULT_DURATION)
    parser.add_argument("--sample-rate", type=int, default=DEFAULT_SAMPLE_RATE)
    parser.add_argument("--model", default=DEFAULT_MODEL)
    parser.add_argument("--language", default=DEFAULT_LANGUAGE)
    return parser.parse_args()


def main():
    args = parse_args()
    wav_path = None

    try:
      import numpy as np
      import sounddevice as sd
      from scipy.io.wavfile import write as write_wav
      from faster_whisper import WhisperModel
    except Exception as error:
      write_error(f"MISSING_DEPENDENCY: {error}")
      return 2

    try:
      frame_count = int(args.duration * args.sample_rate)
      if frame_count <= 0:
        write_error("INVALID_DURATION")
        return 3

      audio = sd.rec(
        frame_count,
        samplerate=args.sample_rate,
        channels=1,
        dtype="float32",
      )
      sd.wait()
    except Exception as error:
      write_error(f"MICROPHONE_ERROR: {error}")
      return 3

    try:
      audio_int16 = np.clip(audio, -1.0, 1.0)
      audio_int16 = (audio_int16 * 32767).astype(np.int16)

      with tempfile.NamedTemporaryFile(prefix="jarvis_voice_", suffix=".wav", delete=False) as wav_file:
        wav_path = wav_file.name

      write_wav(wav_path, args.sample_rate, audio_int16)
    except Exception as error:
      write_error(f"AUDIO_WRITE_ERROR: {error}")
      return 4

    try:
      model = WhisperModel(args.model, device="cpu", compute_type="int8")
      segments, _info = model.transcribe(
        wav_path,
        language=args.language,
        beam_size=5,
      )
      text = " ".join(segment.text.strip() for segment in segments).strip()

      if not text:
        write_error("NO_SPEECH")
        return 5

      print(text, flush=True)
      return 0
    except Exception as error:
      write_error(f"TRANSCRIPTION_ERROR: {error}")
      return 4
    finally:
      if wav_path:
        try:
          os.remove(wav_path)
        except OSError:
          pass


if __name__ == "__main__":
    sys.exit(main())
