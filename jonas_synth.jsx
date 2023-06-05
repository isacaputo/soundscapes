import "./styles.css";
import React, { useState, useEffect } from "react";
import * as Tone from "tone";

// https://tonejs.github.io/examples/stepSequencer

// https://tonejs.github.io/docs/14.7.77/Chorus
const chorus = new Tone.Chorus(1.2, 0.3, 0.7).toDestination().start();

// https://tonejs.github.io/docs/14.7.77/Reverb
==

// https://tonejs.github.io/docs/14.7.77/type/Time

const piano = new Tone.Sampler({
  urls: {
    A0: "A0.mp3",
    C1: "C1.mp3",
    "D#1": "Ds1.mp3",
    "F#1": "Fs1.mp3",
    A1: "A1.mp3",
    C2: "C2.mp3",
    "D#2": "Ds2.mp3",
    "F#2": "Fs2.mp3",
    A2: "A2.mp3",
    C3: "C3.mp3",
    "D#3": "Ds3.mp3",
    "F#3": "Fs3.mp3",
    A3: "A3.mp3",
    C4: "C4.mp3",
    "D#4": "Ds4.mp3",
    "F#4": "Fs4.mp3",
    A4: "A4.mp3",
    C5: "C5.mp3",
    "D#5": "Ds5.mp3",
    "F#5": "Fs5.mp3",
    A5: "A5.mp3",
    C6: "C6.mp3",
    "D#6": "Ds6.mp3",
    "F#6": "Fs6.mp3",
    A6: "A6.mp3",
    C7: "C7.mp3",
    "D#7": "Ds7.mp3",
    "F#7": "Fs7.mp3",
    A7: "A7.mp3",
    C8: "C8.mp3",
  },
  baseUrl: "https://tonejs.github.io/audio/salamander/",
});

// [
//   "C#3",
//   null,
//   "D#3",
//   null,
//   "E3",
//   null,
//   "D#3",
//   null,
//   "C#3",
//   null,
//   "D#3",
//   null,
//   "E3",
//   "B2",
//   "E2",
//   null
// ],

// [
//   // A7M/C#
//   ["C#3", "A3", "E4", "A3"],
//   ["G#4", "A3", "E4", "A3"],
//   // G#m7/D#
//   ["D#3", "F#3", "B3", "F#3"],
//   ["D#4", "F#3", "B3", "F#3"],
//   // A7M/E
//   ["E3", "A3", "C#4", "A3"],
//   ["G#4", "A3", "C#4", "A3"],
//   // G#m(11)/D#
//   ["D#3", "G#3", "B3", "G#3"],
//   ["C#4", "G#3", "B3", "G#3"],
//   // A6(9)/C#
//   ["C#3", "F#3", "A3", "F#3"],
//   ["B3", "F#3", "A3", "E3"],
//   // G#m7/D#
//   ["D#3", "F#3", "B3", "F#3"],
//   ["D#4", "F#3", "B3", "F#3"],
//   // A7M/E
//   ["E3", "A3", "C#4", "A3"],
//   // B7(4/9)
//   ["B2", "E3", "C#4", "E3"],
//   // E
//   ["E2", "E3", "G#3", "E3"],
//   ["B3", null, "E3", null]
// ],


// [
//   "C#3",
//   null,
//   null,
//   null,
//   "D#3",
//   null,
//   null,
//   null,
//   "E3",
//   null,
//   null,
//   null,
//   "D#3",
//   null,
//   null,
//   null,
// ],

// [
//   ["C#3", "D#"]
//   null,
//   null,
//   null,
//   "D#3",
//   null,
//   null,
//   null,
//   "E3",
//   null,
//   null,
//   null,
//   "D#3",
//   null,
//   null,
//   null,
// ],

export default function App() {
  const [tempo, setTempo] = useState(1);
  const [play, setPlay] = useState(false);
  const [leftHandNote, setLeftHandNote] = useState();
  const [rightHandNote, setRightHandNote] = useState();

  useEffect(() => {
    piano.chain(reverb, chorus).toDestination();

    const leftHandSequence = new Tone.Sequence(
      (time, note) => {
        setLeftHandNote(note);
        setPlay(true);
        piano.triggerAttackRelease(note, tempo * 4, time);
      },
      [
        "C#3",
        null,
        null,
        null,
        "D#3",
        null,
        null,
        null,
        "E3",
        null,
        null,
        null,
        "D#3",
        null,
        null,
        null,
      ],
      tempo
    ).start(0);

    const rightHandSequence = new Tone.Sequence(
      (time, note) => {
        setRightHandNote(note);
        setPlay(true);
        piano.triggerAttackRelease(note, tempo, time);
      },
      [
        // A7M/C#
        ["C#3", "A3", "E4", "A3"],
        ["G#4", "A3", "E4", "A3"],
        // G#m7/D#
        ["D#3", "F#3", "B3", "F#3"],
        ["D#4", "F#3", "B3", "F#3"],
        // A7M/E
        ["E3", "A3", "C#4", "A3"],
        ["G#4", "A3", "C#4", "A3"],
        // G#m(11)/D#
        ["D#3", "G#3", "B3", "G#3"],
        ["C#4", "G#3", "B3", "G#3"],
        // A6(9)/C#
        ["C#3", "F#3", "A3", "F#3"],
        ["B3", "F#3", "A3", "E3"],
        // G#m7/D#
        ["D#3", "F#3", "B3", "F#3"],
        ["D#4", "F#3", "B3", "F#3"],
        // A7M/E
        ["E3", "A3", "C#4", "A3"],
        // B7(4/9)
        ["B2", "E3", "C#4", "E3"],
        // E
        ["E2", "E3", "G#3", "E3"],
        ["B3", null, "E3", null],
      ],
      tempo
    ).stop(0);

    return () => {
      leftHandSequence.clear();
      rightHandSequence.clear();
    };
  }, [tempo]);

  const handleTogglePlay = () => {
    const nextPlayState = !play;
    if (nextPlayState) {
      Tone.Transport.start();
    } else {
      Tone.Transport.stop();
    }
    setPlay(nextPlayState);
  };

  return (
    <div className="App">
      <h1>Hello CodeSandbox</h1>
      <h2>Start editing to see some magic happen!</h2>

      <input
        type="number"
        min="0"
        value={tempo}
        onChange={(e) => setTempo(e.target.value)}
      />

      <br />
      <br />

      <button onClick={handleTogglePlay}>{play ? "stop" : "play"}</button>
      <br />
      <span>
        Left hand: <strong>{leftHandNote}</strong>
      </span>
      <br />
      <span>
        Right hand: <strong>{rightHandNote}</strong>
      </span>
    </div>
  );
}
