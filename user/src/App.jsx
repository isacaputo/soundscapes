import { useCallback, useRef, useState } from "react";
import { useEffect } from "react";
import * as Tone from "tone";
import "./App.css";
import Button from "@mui/material/Button";
import PlayCircleFilledWhiteIcon from "@mui/icons-material/PlayCircleFilledWhite";
import StopCircleIcon from "@mui/icons-material/StopCircle";
import { IconButton } from "@mui/material";

// notes = ["C", "D", "E", "F", "G", "A", "B"]
// octaves = [3, 4, 5]
// A = La, B = Si, C = Dó, D = Ré, E = Mi, F = Fa, G = Sol
// C, D, E, F, G, A, B
// 1. Dó | 2. Ré | 3. Mi | 4. Fa | 5. Sol | 6. Lá | 7. Si  ()

const reverb = new Tone.Reverb({
  decay: 1.5,
  wet: 1,
}).toDestination();

const tremolo = new Tone.Tremolo({
  frequency: 1, // step="0.5" min="1" max="15
  depth: 0.8,
})
  .toDestination()
  .start();

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
})
  .chain(tremolo, reverb)
  .toDestination();

const amSynth = new Tone.AMSynth().connect(tremolo).toDestination();
const fmSynth = new Tone.FMSynth().connect(tremolo).toDestination();
const basicSynth = new Tone.Synth({
  volume: -10,
}).toDestination();
const membraneSynth = new Tone.MembraneSynth().toDestination();
const pluckySynth = new Tone.PluckSynth().toDestination();
const monoSynth = new Tone.MonoSynth({
  oscillator: {
    type: "square",
  },
  envelope: {
    attack: 0,
  },
  volume: -10,
}).toDestination();
const sampler = new Tone.Sampler({
  urls: {
    A1: "A1.mp3",
    A2: "A2.mp3",
  },
  baseUrl: "https://tonejs.github.io/audio/casio/",
}).toDestination();

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

// todo
const InstrumentMap = {
  piano: piano,
  amSynth: amSynth,
};

export default function App() {
  const [backgroundInstrument, setBackgroundInstrument] = useState(piano);
  const [mainInstrument, setMainInstrument] = useState(piano);
  const [tempo, setTempo] = useState(1);
  const [play, setPlay] = useState(false);
  const [countTempo, setCountTempo] = useState(null);
  const intervalRef = useRef();
  const [backgroundVolume, setBackgroundVolume] = useState(-10);
  const [mainVolume, setMainVolume] = useState(-10);

  const handleChangeBackVolume = (event, newValue) => {
    // const vol = new Tone.Volume(newValue).toDestination();
    setBackgroundVolume(newValue);
  };

  const handleChangeMainVolume = (event, newValue) => {
    // const vol = new Tone.Volume(newValue).toDestination();
    setMainVolume(newValue);
  };

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

  const handleClickBackInstrument = (instrument) => {
    setBackgroundInstrument(instrument);
  };

  const handleClickMainInstrument = (instrument) => {
    setMainInstrument(instrument);
  };

  const startCountTempo = () => {
    setCountTempo(0);
    clearInterval(intervalRef.current);
    intervalRef.current = setInterval(() => {
      setCountTempo((previous) =>
        previous === mainSequence.length - 1 ? 0 : previous + 1
      );
    }, 500);
  };

  const stopCountTempo = () => {
    setCountTempo(null);
    clearInterval(intervalRef.current);
  };

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
        backgroundInstrument.triggerAttackRelease(
          note,
          tempo * notesPerCompass,
          time
        );
      },
      chunkSequence(backgroundSequence, 2),
      tempo
    ).start(0);

    const mSequence = new Tone.Sequence(
      (time, note) => {
        setPlay(true);
        mainInstrument.triggerAttackRelease(note, tempo, time);
      },
      mainSequence,
      0.5
    ).start(0);

    return () => {
      bSequence.clear();
      mSequence.clear();
    };
  }, [
    tempo,
    backgroundSequence,
    mainSequence,
    backgroundInstrument,
    mainInstrument,
  ]);

  const handleTogglePlay = () => {
    const nextPlayState = !play;
    if (nextPlayState) {
      Tone.Transport.start();
      startCountTempo();
    } else {
      Tone.Transport.stop();
      // backgroundInstrument.dispose();
      stopCountTempo();
    }
    setPlay(nextPlayState);
  };

  const handleToggleNoteBackSeq = (note, index, isBackNoteActive) => {
    if (!isBackNoteActive) {
      const now = Tone.now();
      backgroundInstrument.triggerAttackRelease(note, "8n", now);
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
      mainInstrument.triggerAttackRelease(note, "8n", now);
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
          className={`note ${isMainNoteActive ? "active" : ""}`}
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
    <div className="board">
      <img src={`/images/soundscapes-logo.png`} className="logo-image" />
      <div className="main-sequence">
        {mainSequence.map((_, index) => {
          if (getNext4ndIndex(index)) {
            countBlock++;
            return (
              <div className="compass" key={index}>
                {mainSequence.map((_, subIndex) => {
                  const fromB = countBlock * notesPerCompass - notesPerCompass;
                  const toB = countBlock * notesPerCompass;
                  if (subIndex >= fromB && subIndex < toB) {
                    const isHighlighted = countTempo === subIndex;
                    return (
                      <div
                        key={`${index}-${subIndex}`}
                        className={`notes ${
                          isHighlighted ? "highlighted" : ""
                        }`}
                      >
                        {renderNotesMainSequence(subIndex)}
                      </div>
                    );
                  }
                  return null;
                })}
              </div>
            );
          }
        })}{" "}
        {
          <div className="synth-options">
            <Button
              sx={{
                "&:hover": { backgroundColor: "#5E17EB", color: "white" },
              }}
              variant="contained"
              size="small"
              onClick={() => handleClickMainInstrument(piano)}
              value={piano}
            >
              {"piano"}
            </Button>
            <Button
              sx={{
                "&:hover": { backgroundColor: "#5E17EB", color: "white" },
              }}
              variant="contained"
              size="small"
              onClick={() => handleClickMainInstrument(amSynth)}
              value={amSynth}
            >
              {"AM Synth"}
            </Button>
            <Button
              sx={{
                "&:hover": { backgroundColor: "#5E17EB", color: "white" },
              }}
              variant="contained"
              size="small"
              onClick={() => handleClickMainInstrument(fmSynth)}
              value={fmSynth}
            >
              {"FM Synth"}
            </Button>
            <Button
              sx={{
                "&:hover": { backgroundColor: "#5E17EB", color: "white" },
              }}
              variant="contained"
              size="small"
              onClick={() => handleClickMainInstrument(monoSynth)}
              value={monoSynth}
            >
              {"Mono Synth"}
            </Button>
            <Button
              sx={{
                "&:hover": { backgroundColor: "#5E17EB", color: "white" },
              }}
              variant="contained"
              size="small"
              onClick={() => handleClickMainInstrument(basicSynth)}
              value={basicSynth}
            >
              {"Basic Synth"}
            </Button>
          </div>
        }
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
        {
          <div className="synth-options">
            <Button
              sx={{
                "&:hover": { backgroundColor: "#5E17EB", color: "white" },
              }}
              variant="contained"
              size="small"
              onClick={() => handleClickBackInstrument(piano)}
              value={piano}
            >
              {"piano"}
            </Button>
            <Button
              sx={{
                "&:hover": { backgroundColor: "#5E17EB", color: "white" },
              }}
              variant="contained"
              size="small"
              onClick={() => handleClickBackInstrument(amSynth)}
              value={amSynth}
            >
              {"AM Synth"}
            </Button>
            <Button
              sx={{
                "&:hover": { backgroundColor: "#5E17EB", color: "white" },
              }}
              variant="contained"
              size="small"
              onClick={() => handleClickBackInstrument(fmSynth)}
              value={fmSynth}
            >
              {"FM Synth"}
            </Button>
            <Button
              sx={{
                "&:hover": { backgroundColor: "#5E17EB", color: "white" },
              }}
              variant="contained"
              size="small"
              onClick={() => handleClickBackInstrument(monoSynth)}
              value={monoSynth}
            >
              {"Mono Synth"}
            </Button>
            <Button
              sx={{
                "&:hover": { backgroundColor: "#5E17EB", color: "white" },
              }}
              variant="contained"
              size="small"
              onClick={() => handleClickBackInstrument(basicSynth)}
              value={basicSynth}
            >
              {"Basic Synth"}
            </Button>
            <div>
              <IconButton onClick={handleTogglePlay}>
                {play ? (
                  <StopCircleIcon />
                ) : (
                  <PlayCircleFilledWhiteIcon onClick={handleTogglePlay} />
                )}
              </IconButton>
            </div>
          </div>
        }
      </div>
    </div>
  );
}
