import { useCallback, useRef, useState, useMemo } from "react";
import { useEffect } from "react";
import * as Tone from "tone";
import "./App.css";
import Button from "@mui/material/Button";
import PlayCircleIcon from "@mui/icons-material/PlayCircle";
import StopCircleIcon from "@mui/icons-material/StopCircle";
import { IconButton } from "@mui/material";
import ToggleButton from "@mui/material/ToggleButton";
import ToggleButtonGroup from "@mui/material/ToggleButtonGroup";
import PianoIcon from "@mui/icons-material/Piano";
import Box from "@mui/material/Box";
import RadioIcon from "@mui/icons-material/Radio";
import StraightenIcon from "@mui/icons-material/Straighten";
import Stack from "@mui/material/Stack";
import Slider from "@mui/material/Slider";
import VolumeDown from "@mui/icons-material/VolumeDown";
import VolumeUp from "@mui/icons-material/VolumeUp";

// notes = ["C", "D", "E", "F", "G", "A", "B"]
// octaves = [3, 4, 5]
// A = La, B = Si, C = Dó, D = Ré, E = Mi, F = Fa, G = Sol
// C, D, E, F, G, A, B
// 1. Dó | 2. Ré | 3. Mi | 4. Fa | 5. Sol | 6. Lá | 7. Si  ()

// const sampler = new Tone.Sampler({
//   urls: {
//     A1: "A1.mp3",
//     A2: "A2.mp3",
//   },
//   baseUrl: "https://tonejs.github.io/audio/casio/",
// }).toDestination();

//Effects
const reverb = new Tone.Reverb({
  decay: 1.5,
  wet: 1,
}).toDestination();

//Instruments
// const piano = new Tone.Sampler({
//   volume: -10,
//   urls: {
//     A0: "A0.mp3",
//     C1: "C1.mp3",
//     "D#1": "Ds1.mp3",
//     "F#1": "Fs1.mp3",
//     A1: "A1.mp3",
//     C2: "C2.mp3",
//     "D#2": "Ds2.mp3",
//     "F#2": "Fs2.mp3",
//     A2: "A2.mp3",
//     C3: "C3.mp3",
//     "D#3": "Ds3.mp3",
//     "F#3": "Fs3.mp3",
//     A3: "A3.mp3",
//     C4: "C4.mp3",
//     "D#4": "Ds4.mp3",
//     "F#4": "Fs4.mp3",
//     A4: "A4.mp3",
//     C5: "C5.mp3",
//     "D#5": "Ds5.mp3",
//     "F#5": "Fs5.mp3",
//     A5: "A5.mp3",
//     C6: "C6.mp3",
//     "D#6": "Ds6.mp3",
//     "F#6": "Fs6.mp3",
//     A6: "A6.mp3",
//     C7: "C7.mp3",
//     "D#7": "Ds7.mp3",
//     "F#7": "Fs7.mp3",
//     A7: "A7.mp3",
//     C8: "C8.mp3",
//   },
//   baseUrl: "https://tonejs.github.io/audio/salamander/",
// })
//   .chain(tremolo, reverb)
//   .toDestination();

// const instruments = {
//   piano: piano,
//   amSynth: amSynth,
//   basicSynth: basicSynth,
// };

// Notes scale
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

// Function to divide main sequence in 8 compass
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

// Number of compass and notes per compass
const notesPerCompass = 4;
const compass = 8;

export default function App() {
  const [backgroundInstrument, setBackgroundInstrument] = useState("piano");
  const [mainInstrument, setMainInstrument] = useState("piano");
  const [tempo, setTempo] = useState(1);
  const [play, setPlay] = useState(false);
  const [countTempo, setCountTempo] = useState(null);
  const intervalRef = useRef();
  const [tremoloFrequency, setTremoloFrequency] = useState(1);
  const [backgroundVolume, setBackgroundVolume] = useState(-10);
  const [mainVolume, setMainVolume] = useState(-10);
  const [backgroundSequence, setBackgroundSequence] = useState(
    Array.from({ length: compass * 4 }).fill(null)
  );
  const [mainSequence, setMainSequence] = useState(
    Array.from({ length: compass * notesPerCompass }).fill("A3")
  );

  //Effects
  const tremolo = useMemo(() => {
    const tremoloEffect = new Tone.Tremolo({
      frequency: tremoloFrequency, // step="0.5" min="1" max="15
      depth: 0.8,
    })
      .toDestination()
      .start();

    return tremoloEffect;
  }, [tremoloFrequency]);

  const mainSynths = useMemo(() => {
    const mainAmSynth = new Tone.AMSynth({
      volume: mainVolume,
    })
      .connect(tremolo)
      .toDestination();

    const mainPiano = new Tone.Sampler({
      volume: mainVolume,
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

    const mainBasicSynth = new Tone.Synth({
      volume: mainVolume,
    }).toDestination();

    return {
      piano: mainPiano,
      amSynth: mainAmSynth,
      basicSynth: mainBasicSynth,
    };
  }, [mainVolume]);

  const backgroundSynths = useMemo(() => {
    const backAmSynth = new Tone.AMSynth({
      volume: backgroundVolume,
    })
      .connect(tremolo)
      .toDestination();

    const backPiano = new Tone.Sampler({
      volume: backgroundVolume,
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

    const backBasicSynth = new Tone.Synth({
      volume: backgroundVolume,
    }).toDestination();

    return {
      piano: backPiano,
      amSynth: backAmSynth,
      basicSynth: backBasicSynth,
    };
  }, [backgroundVolume]);

  const getNext4ndIndex = (index) => {
    return index % 4 === 0;
  };

  const getNext8ndIndex = (index) => {
    return index % 8 === 0;
  };

  // Handling synth choice
  const handleMainInstrumentChoice = (event, synthChoice) => {
    const instrument = synthChoice;
    for (const synth in mainSynths) {
      if (instrument === synth) {
        setMainInstrument(synth);
      }
    }
  };

  const handleBackInstrumentChoice = (event, synthChoice) => {
    const instrument = synthChoice;
    for (const synth in backgroundSynths) {
      if (instrument === synth) {
        setBackgroundInstrument(synth);
      }
    }
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
        backgroundSynths[backgroundInstrument].triggerAttackRelease(
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
        mainSynths[mainInstrument].triggerAttackRelease(note, tempo, time);
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
    mainSynths,
    backgroundSynths,
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
    if (!isBackNoteActive && !play) {
      const now = Tone.now();
      backgroundSynths[backgroundInstrument].triggerAttackRelease(
        note,
        "8n",
        now
      );
    }
    const copyBackgroundSequence = [...backgroundSequence];
    copyBackgroundSequence[index] =
      backgroundSequence[index] && backgroundSequence[index] === note
        ? null
        : note;

    setBackgroundSequence(copyBackgroundSequence);
  };

  const handleToggleNoteMainSeq = (note, index, isMainNoteActive) => {
    if (!isMainNoteActive && !play) {
      const now = Tone.now();
      mainSynths[mainInstrument].triggerAttackRelease(note, "8n", now);
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
        ></div>
      );
    });

  let countBlock = 0;

  const handleMainVolumeChange = (event, newValue) => {
    setMainVolume(newValue);
  };

  const handleBackVolumeChange = (event, newValue) => {
    setBackgroundVolume(newValue);
  };

  return (
    <div className="board">
      <img src={`/images/soundscapes-logo.png`} className="logo-image" />
      <div className="main-sequence-container">
        {/* <div className="main-notes-display-container">
          {mainNotes.map((note) => (
            <div className="main-notes-display">{note}</div>
          ))}
        </div> */}
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
              <ToggleButtonGroup
                defaultValue="piano"
                value={mainInstrument}
                size="large"
                orientation="vertical"
                exclusive
                onChange={handleMainInstrumentChoice}
                sx={{ width: "90px" }}
              >
                <ToggleButton value="piano" aria-label="list">
                  <PianoIcon sx={{ color: "#5e17eb" }} />
                </ToggleButton>
                <ToggleButton value="amSynth" aria-label="module">
                  <RadioIcon sx={{ color: "#5e17eb" }} />
                </ToggleButton>

                <ToggleButton value="basicSynth" aria-label="quilt">
                  <StraightenIcon sx={{ color: "#5e17eb" }} />
                </ToggleButton>
              </ToggleButtonGroup>
              <Box sx={{ width: "120px" }}>
                <Stack
                  spacing={1}
                  direction="row"
                  sx={{ mb: 1 }}
                  alignItems="center"
                >
                  <VolumeDown />
                  <Slider
                    aria-label="mainVolume"
                    min={-30}
                    max={10}
                    value={mainVolume}
                    onChange={handleMainVolumeChange}
                  />
                  <VolumeUp />
                </Stack>
              </Box>
            </div>
          }
        </div>
      </div>
      <div className="back-sequence-container">
        <div className="back-notes-display-container">
          {backgroundNotes.map((note, index) => (
            <div key={index} className="back-notes-display">
              {note}
            </div>
          ))}
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
              <ToggleButtonGroup
                defaultValue="piano"
                value={backgroundInstrument}
                size="large"
                orientation="vertical"
                exclusive
                onChange={handleBackInstrumentChoice}
                sx={{ width: "90px" }}
              >
                <ToggleButton
                  value="piano"
                  aria-label="list"
                  sx={{ maxHeight: "65px" }}
                >
                  <PianoIcon sx={{ color: "#22C2F1" }} />
                </ToggleButton>
                <ToggleButton
                  value="amSynth"
                  aria-label="module"
                  sx={{ maxHeight: "65px" }}
                >
                  <RadioIcon sx={{ color: "#22C2F1" }} />
                </ToggleButton>

                <ToggleButton
                  value="basicSynth"
                  aria-label="quilt"
                  sx={{ maxHeight: "65px" }}
                >
                  <StraightenIcon sx={{ color: "#22C2F1" }} />
                </ToggleButton>
              </ToggleButtonGroup>
              <Box sx={{ width: "120px" }}>
                <Stack
                  spacing={1}
                  direction="row"
                  sx={{ mb: 1, mt: 1 }}
                  alignItems="center"
                >
                  <VolumeDown />
                  <Slider
                    aria-label="backVolume"
                    min={-30}
                    max={10}
                    value={backgroundVolume}
                    onChange={handleBackVolumeChange}
                  />
                  <VolumeUp />
                </Stack>
              </Box>
              <Box sx={{ width: "80px" }}>
                <Slider
                  aria-label="Temperature"
                  defaultValue={30}
                  // getAriaValueText={valuetext}
                  valueLabelDisplay="auto"
                  step={10}
                  marks
                  min={10}
                  max={110}
                />
              </Box>

              <div className="play-stop-container">
                <IconButton
                  size="large"
                  onClick={handleTogglePlay}
                  className="play-stop-icon"
                >
                  {play ? (
                    <StopCircleIcon />
                  ) : (
                    <PlayCircleIcon sx={{ color: "#5e17eb" }} />
                  )}
                </IconButton>
              </div>
            </div>
          }
        </div>
      </div>
    </div>
  );
}
