"""Render the three original invitation scores using synthesized tones only.

Run manually with NumPy and FFmpeg when changing a score. Production serves
the resulting MP3s directly. The scores and recordings are released under CC0.
"""
from pathlib import Path
import subprocess

import numpy as np

RATE = 32000
OUTPUT = Path(__file__).resolve().parents[2] / "dist" / "jemputan"
# Each melody row is a bar of (beat offset, MIDI pitch, duration in beats).
SCORES = {
    "seri-melur": (80, 3, "lute", [50, 55, 52, 57, 50, 55, 57, 50], [
        [(0, 69, .8), (1, 71, .4), (1.5, 74, 1.2)],
        [(.5, 71, .8), (1.5, 67, 1.2)], [(0, 66, .65), (1, 69, .7), (2, 71, .7)],
        [(0, 69, 1.7)], [(.5, 74, .7), (1.5, 78, .6), (2.25, 76, .45)],
        [(0, 74, .9), (1.5, 71, 1)], [(0, 69, .8), (1, 67, .5), (2, 64, .7)],
        [(0, 66, .7), (1, 62, 1.7)]]),
    "double-happiness": (74, 4, "zither", [48, 55, 53, 48, 57, 53, 55, 48], [
        [(.5, 72, .7), (1.5, 76, .5), (2.25, 79, 1.5)],
        [(0, 81, 1.2), (2, 79, .6), (3, 74, .75)],
        [(.5, 72, 1), (2, 69, .65), (3, 72, .65)], [(0, 76, 2.3)],
        [(0, 81, .7), (1, 84, 1.1), (2.5, 81, .8)],
        [(0, 79, 1.1), (1.75, 76, .6), (2.75, 72, .8)],
        [(.5, 74, .65), (1.5, 79, .9), (3, 76, .7)], [(0, 74, .7), (1, 72, 2.2)]]),
    "malli": (68, 4, "flute", [50] * 8, [
        [(.5, 62, 1.1), (2, 65, 1.5)], [(0, 67, .75), (1, 69, 1.8)],
        [(.5, 72, 1.2), (2, 69, .6), (3, 67, .7)], [(0, 65, 1.1), (1.5, 64, 1.7)],
        [(0, 67, .7), (1, 69, .8), (2.25, 74, 1.4)],
        [(0, 72, 1.3), (2, 69, 1.5)], [(.5, 67, .8), (1.5, 65, .7), (2.5, 64, 1.1)],
        [(0, 62, 2.9)]])
}


def tone(pitch, seconds, voice):
    t = np.arange(int(seconds * RATE)) / RATE
    hz = 440 * 2 ** ((pitch - 69) / 12)
    phase = 2 * np.pi * hz * t
    if voice == "flute":
        phase += .32 * np.sin(2 * np.pi * 4.6 * t) - .9 * (1 - np.exp(-18*t))
        wave = np.sin(phase) + .16*np.sin(2*phase) + .08*np.sin(3*phase)
        envelope = (1-np.exp(-13*t)) * (.9 + .1*np.cos(3*t))
    else:
        harmonics = {"lute": [1,.48,.22,.19,.08], "zither": [1,.38,.34,.19,.14,.1],
                     "bass": [1,.2,.08], "drone": [1,.44,.22,.12]}[voice]
        decay = {"lute": 2.1, "zither": 1.55, "bass": 1.8, "drone": .85}[voice]
        wave = sum(level*np.sin(phase*n*(1+.00007*n*n))*np.exp(-decay*t*(1+.2*n))
                   for n, level in enumerate(harmonics, 1))
        envelope = 1 - np.exp(-150*t)
    return wave * envelope * np.clip((seconds-t)/min(.18,seconds/3),0,1)


def render(slug, bpm, beats, voice, roots, melody):
    beat = 60 / bpm
    length = round(len(melody)*beats*beat*RATE)
    mix = np.zeros(length)

    def play(at, pitch, duration, instrument, volume):
        sound = volume * tone(pitch, duration*beat, instrument)
        # Fold tails across the boundary for continuous looping.
        indices = (round(at*beat*RATE) + np.arange(len(sound))) % length
        mix[indices] += sound

    for bar, (root, phrase) in enumerate(zip(roots, melody)):
        start = bar * beats
        for offset, pitch, duration in phrase:
            play(start+offset, pitch, duration+.2, voice, .53)
        if voice == "flute":
            for offset, interval in [(0,7),(1,12),(2,12),(3,0)]:
                play(start+offset, root+interval-12, 3.5, "drone", .13)
        else:
            play(start, root, 2.3, "bass", .31)
            play(start + (1.5 if beats==3 else 2), root+7, 1.6, voice, .15)
    mix += .14*np.roll(mix, int(.17*RATE)) + .08*np.roll(mix,int(.31*RATE))
    mix *= .28 / np.max(np.abs(mix))
    subprocess.run(["ffmpeg","-loglevel","error","-y","-f","f32le","-ar",str(RATE),
                    "-ac","1","-i","pipe:0","-codec:a","libmp3lame","-q:a","6",
                    "-metadata","comment=Original synthesized score and recording - CC0 1.0",
                    str(OUTPUT/slug/"music.mp3")],input=mix.astype("<f4").tobytes(),check=True)


if __name__ == "__main__":
    for slug, score in SCORES.items():
        render(slug, *score)
