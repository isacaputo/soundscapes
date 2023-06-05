import { useCallback, useRef, useState } from "react";
import { useEffect } from "react";
import * as Tone from "tone";
import "./App.css";
import { styled } from "@mui/material/styles";
import Grid from "@mui/material/Grid";
import Button from "@mui/material/Button";
import { purple } from "@mui/material/colors";

// notes = ["C", "D", "E", "F", "G", "A", "B"]
// octaves = [3, 4, 5]
// A = La, B = Si, C = Dó, D = Ré, E = Mi, F = Fa, G = Sol
// C, D, E, F, G, A, B
// 1. Dó | 2. Ré | 3. Mi | 4. Fa | 5. Sol | 6. Lá | 7. Si  ()

// const chorus = new Tone.Chorus(1.2, 0.3, 0.7).toDestination();
// const reverb = new Tone.Reverb({
//   decay: 1.5,
//   wet: 1,
// }).toDestination();

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
}).toDestination();

// const synth = new Tone.MonoSynth({
//   oscillator: {
//     type: "square",
//   },
//   envelope: {
//     attack: 0.1,
//   },
// }).toDestination();

const backgroundNotes = [
  "A2",
  "B2",
  "C2",
  "D2",
  "E2",
  "F2",
  "G2",
  "A3",
].reverse();

const mainNotes = ["A3", "B3", "C4", "D4", "E4", "F4", "G4", "A4"].reverse();

const chunkSequence = (sequence, size) => {
  return sequence.reduce((acc, note, index) => {
    const chunkIndex = Math.floor(index / size);
    if (!acc[chunkIndex]) {
      acc[chunkIndex] = []; // start a new chunk
    }
    acc[chunkIndex].push(note);
    return acc;
  }, []);
};

const notesPerCompass = 4;
const compass = 8;

export default function App() {
  const [tempo, setTempo] = useState(1);
  const [play, setPlay] = useState(false);
  const [countTempo, setCountTempo] = useState(null);
  const intervalRef = useRef();

  const [backgroundSequence, setBackgroundSequence] = useState(
    Array.from({ length: compass * 4 }).fill(null)
  );
  // ["A2", null, null, null, "C2", null, null, null, "D2", null, null, null, "E2", null, null, null];

  const [mainSequence, setMainSequence] = useState(
    Array.from({ length: compass * notesPerCompass }).fill(null)
  );
  // ["A2", null, null, null, "C2", null, null, null, "D2", null, null, null, "E2", null, null, null];

  const getNext4ndIndex = (index) => {
    return index % 4 === 0;
  };

  const getNext8ndIndex = (index) => {
    return index % 8 === 0;
  };

  const startCountTempo = () => {
    setCountTempo(0);
    clearInterval(intervalRef.current);
    intervalRef.current = setInterval(() => {
      setCountTempo((previous) => (previous === 31 ? 0 : previous + 1));
    }, 500);
  };

  const stopCountTempo = () => {
    setCountTempo(null);
    clearInterval(intervalRef.current);
  };

  console.log("countTempo", countTempo);
  console.log(backgroundSequence, mainSequence);

  useEffect(() => {
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, []);

  useEffect(() => {
    const bSequence = new Tone.Sequence(
      (time, note) => {
        setPlay(true);
        piano.triggerAttackRelease(note, tempo * notesPerCompass, time);
      },
      chunkSequence(backgroundSequence, 2),
      tempo
    ).start(0);

    const mSequence = new Tone.Sequence(
      (time, note) => {
        setPlay(true);
        piano.triggerAttackRelease(note, tempo, time);
      },
      mainSequence,
      0.5
    ).start(0);

    return () => {
      bSequence.clear();
      mSequence.clear();
    };
  }, [tempo, backgroundSequence, mainSequence, countTempo, intervalRef]);

  const handleTogglePlay = () => {
    const nextPlayState = !play;
    if (nextPlayState) {
      Tone.Transport.start();
      console.log("start");
      startCountTempo();
    } else {
      Tone.Transport.stop();
      console.log("stop");
      stopCountTempo();
    }
    setPlay(nextPlayState);
  };

  const handleToggleNoteBackSeq = (note, index, isBackNoteActive) => {
    if (!isBackNoteActive) {
      const now = Tone.now();
      piano.triggerAttackRelease(note, "8n", now);
    }
    const copyBackgroundSequence = [...backgroundSequence];
    copyBackgroundSequence[index] =
      backgroundSequence[index] && backgroundSequence[index] === note
        ? null
        : note;

    setBackgroundSequence(copyBackgroundSequence);
  };

  const handleToggleNoteMainSeq = (note, index, isMainNoteActive) => {
    if (!isMainNoteActive) {
      const now = Tone.now();
      piano.triggerAttackRelease(note, "8n", now);
    }
    const copyMainSequence = [...mainSequence];
    copyMainSequence[index] =
      mainSequence[index] && mainSequence[index] === note ? null : note;
    setMainSequence(copyMainSequence);
  };

  const renderNotesBackSequence = (indexCompass) =>
    backgroundNotes.map((note, indexNote) => {
      const isBackNoteActive = backgroundSequence[indexCompass] === note;
      return (
        <div
          key={`${indexCompass}-${indexNote}`}
          onClick={() =>
            handleToggleNoteBackSeq(note, indexCompass, isBackNoteActive)
          }
          className={`note ${isBackNoteActive && "active"}`}
        >
          {/* {note} */}
        </div>
      );
    });

  const renderNotesMainSequence = (indexCompass) =>
    mainNotes.map((note, indexNote) => {
      const isMainNoteActive = mainSequence[indexCompass] === note;

      return (
        <div
          className={
            countTempo === indexCompass
              ? "tempoVisible"
              : `note ${isMainNoteActive && "active"}`
          }
          key={`${indexCompass}-${indexNote}`}
          onClick={() =>
            handleToggleNoteMainSeq(note, indexCompass, isMainNoteActive)
          }
        >
          {/* {note} */}
        </div>
      );
    });

  let countBlock = 0;

  return (
    <>
      <div className="board">
        <div className="main-sequence">
          {mainSequence.map((_, index) => {
            if (getNext4ndIndex(index)) {
              countBlock++;
              return (
                <div className="compass" key={index}>
                  {mainSequence.map((_, subIndex) => {
                    const fromB =
                      countBlock * notesPerCompass - notesPerCompass;
                    const toB = countBlock * notesPerCompass;
                    if (subIndex >= fromB && subIndex < toB) {
                      return (
                        <div key={`${index}-${subIndex}`} className={`notes`}>
                          {renderNotesMainSequence(subIndex)}
                        </div>
                      );
                    }
                    return null;
                  })}
                </div>
              );
            }
          })}
        </div>

        <div className="back-sequence">
          {backgroundSequence.map((note, index) => {
            if (getNext8ndIndex(index)) {
              return (
                <div className="back-compass" key={index}>
                  {renderNotesBackSequence(index)}
                </div>
              );
            }
            return null;
          })}
        </div>
        <Grid>
          <Button variant="contained" size="large" onClick={handleTogglePlay}>
            {play ? "stop" : "play"}
          </Button>
        </Grid>
      </div>
    </>
  );
}
