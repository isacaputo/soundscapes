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
import WavesIcon from "@mui/icons-material/Waves";
import SpatialAudioIcon from "@mui/icons-material/SpatialAudio";

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

//Main Sequence Buffers
const buffer1 = new Tone.Buffer(
  "https://tonejs.github.io/audio/salamander/A0.mp3"
);
const buffer2 = new Tone.Buffer(
  "https://tonejs.github.io/audio/salamander/C1.mp3"
);
const buffer3 = new Tone.Buffer(
  "https://tonejs.github.io/audio/salamander/Ds1.mp3"
);
const buffer4 = new Tone.Buffer(
  "https://tonejs.github.io/audio/salamander/Fs1.mp3"
);
const buffer5 = new Tone.Buffer(
  "https://tonejs.github.io/audio/salamander/A1.mp3"
);
const buffer6 = new Tone.Buffer(
  "https://tonejs.github.io/audio/salamander/C2.mp3"
);
const buffer7 = new Tone.Buffer(
  "https://tonejs.github.io/audio/salamander/Ds2.mp3"
);
const buffer8 = new Tone.Buffer(
  "https://tonejs.github.io/audio/salamander/Fs2.mp3"
);
const buffer9 = new Tone.Buffer(
  "https://tonejs.github.io/audio/salamander/A2.mp3"
);
const buffer10 = new Tone.Buffer(
  "https://tonejs.github.io/audio/salamander/C3.mp3"
);
const buffer11 = new Tone.Buffer(
  "https://tonejs.github.io/audio/salamander/Ds3.mp3"
);
const buffer12 = new Tone.Buffer(
  "https://tonejs.github.io/audio/salamander/Fs3.mp3"
);
const buffer13 = new Tone.Buffer(
  "https://tonejs.github.io/audio/salamander/A3.mp3"
);
const buffer14 = new Tone.Buffer(
  "https://tonejs.github.io/audio/salamander/C4.mp3"
);
const buffer15 = new Tone.Buffer(
  "https://tonejs.github.io/audio/salamander/Ds4.mp3"
);
const buffer16 = new Tone.Buffer(
  "https://tonejs.github.io/audio/salamander/Fs4.mp3"
);
const buffer17 = new Tone.Buffer(
  "https://tonejs.github.io/audio/salamander/A4.mp3"
);
const buffer18 = new Tone.Buffer(
  "https://tonejs.github.io/audio/salamander/C5.mp3"
);
const buffer19 = new Tone.Buffer(
  "https://tonejs.github.io/audio/salamander/Ds5.mp3"
);
const buffer20 = new Tone.Buffer(
  "https://tonejs.github.io/audio/salamander/Fs5.mp3"
);
const buffer21 = new Tone.Buffer(
  "https://tonejs.github.io/audio/salamander/A5.mp3"
);
const buffer22 = new Tone.Buffer(
  "https://tonejs.github.io/audio/salamander/C6.mp3"
);
const buffer23 = new Tone.Buffer(
  "https://tonejs.github.io/audio/salamander/Ds6.mp3"
);
const buffer24 = new Tone.Buffer(
  "https://tonejs.github.io/audio/salamander/Fs6.mp3"
);
const buffer25 = new Tone.Buffer(
  "https://tonejs.github.io/audio/salamander/A6.mp3"
);
const buffer26 = new Tone.Buffer(
  "https://tonejs.github.io/audio/salamander/C7.mp3"
);
const buffer27 = new Tone.Buffer(
  "https://tonejs.github.io/audio/salamander/Ds7.mp3"
);
const buffer28 = new Tone.Buffer(
  "https://tonejs.github.io/audio/salamander/Fs7.mp3"
);
const buffer29 = new Tone.Buffer(
  "https://tonejs.github.io/audio/salamander/A7.mp3"
);
const buffer30 = new Tone.Buffer(
  "https://tonejs.github.io/audio/salamander/C8.mp3"
);

//Background Sequence Buffers
const buffer31 = new Tone.Buffer(
  "https://tonejs.github.io/audio/salamander/A0.mp3"
);
const buffer32 = new Tone.Buffer(
  "https://tonejs.github.io/audio/salamander/C1.mp3"
);
const buffer33 = new Tone.Buffer(
  "https://tonejs.github.io/audio/salamander/Ds1.mp3"
);
const buffer34 = new Tone.Buffer(
  "https://tonejs.github.io/audio/salamander/Fs1.mp3"
);
const buffer35 = new Tone.Buffer(
  "https://tonejs.github.io/audio/salamander/A1.mp3"
);
const buffer36 = new Tone.Buffer(
  "https://tonejs.github.io/audio/salamander/C2.mp3"
);
const buffer37 = new Tone.Buffer(
  "https://tonejs.github.io/audio/salamander/Ds2.mp3"
);
const buffer38 = new Tone.Buffer(
  "https://tonejs.github.io/audio/salamander/Fs2.mp3"
);
const buffer39 = new Tone.Buffer(
  "https://tonejs.github.io/audio/salamander/A2.mp3"
);
const buffer40 = new Tone.Buffer(
  "https://tonejs.github.io/audio/salamander/C3.mp3"
);
const buffer41 = new Tone.Buffer(
  "https://tonejs.github.io/audio/salamander/Ds3.mp3"
);
const buffer42 = new Tone.Buffer(
  "https://tonejs.github.io/audio/salamander/Fs3.mp3"
);
const buffer43 = new Tone.Buffer(
  "https://tonejs.github.io/audio/salamander/A3.mp3"
);
const buffer44 = new Tone.Buffer(
  "https://tonejs.github.io/audio/salamander/C4.mp3"
);
const buffer45 = new Tone.Buffer(
  "https://tonejs.github.io/audio/salamander/Ds4.mp3"
);
const buffer46 = new Tone.Buffer(
  "https://tonejs.github.io/audio/salamander/Fs4.mp3"
);
const buffer47 = new Tone.Buffer(
  "https://tonejs.github.io/audio/salamander/A4.mp3"
);
const buffer48 = new Tone.Buffer(
  "https://tonejs.github.io/audio/salamander/C5.mp3"
);
const buffer49 = new Tone.Buffer(
  "https://tonejs.github.io/audio/salamander/Ds5.mp3"
);
const buffer50 = new Tone.Buffer(
  "https://tonejs.github.io/audio/salamander/Fs5.mp3"
);
const buffer51 = new Tone.Buffer(
  "https://tonejs.github.io/audio/salamander/A5.mp3"
);
const buffer52 = new Tone.Buffer(
  "https://tonejs.github.io/audio/salamander/C6.mp3"
);
const buffer53 = new Tone.Buffer(
  "https://tonejs.github.io/audio/salamander/Ds6.mp3"
);
const buffer54 = new Tone.Buffer(
  "https://tonejs.github.io/audio/salamander/Fs6.mp3"
);
const buffer55 = new Tone.Buffer(
  "https://tonejs.github.io/audio/salamander/A6.mp3"
);
const buffer56 = new Tone.Buffer(
  "https://tonejs.github.io/audio/salamander/C7.mp3"
);
const buffer57 = new Tone.Buffer(
  "https://tonejs.github.io/audio/salamander/Ds7.mp3"
);
const buffer58 = new Tone.Buffer(
  "https://tonejs.github.io/audio/salamander/Fs7.mp3"
);
const buffer59 = new Tone.Buffer(
  "https://tonejs.github.io/audio/salamander/A7.mp3"
);
const buffer60 = new Tone.Buffer(
  "https://tonejs.github.io/audio/salamander/C8.mp3"
);

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
  const [tremoloFrequency, setTremoloFrequency] = useState(0);
  const [reverbDecay, setReverbDecay] = useState(1);
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
      frequency: tremoloFrequency, // step="2" min="0" max="15
      depth: 0.8,
    })
      .toDestination()
      .start();

    return tremoloEffect;
  }, [tremoloFrequency]);

  const reverb = useMemo(() => {
    const reverbEffect = new Tone.Reverb({
      decay: reverbDecay, // step="1" min="0" max="10"
      wet: 1,
    }).toDestination();
    return reverbEffect;
  }, [reverbDecay]);

  const mainSynths = useMemo(() => {
    const mainAmSynth = new Tone.AMSynth({
      volume: mainVolume,
    })
      .connect(reverb)
      .toDestination();

    const mainPiano = new Tone.Sampler({
      volume: mainVolume,
      urls: {
        A0: buffer1,
        C1: buffer2,
        "D#1": buffer3,
        "F#1": buffer4,
        A1: buffer5,
        C2: buffer6,
        "D#2": buffer7,
        "F#2": buffer8,
        A2: buffer9,
        C3: buffer10,
        "D#3": buffer11,
        "F#3": buffer12,
        A3: buffer13,
        C4: buffer14,
        "D#4": buffer15,
        "F#4": buffer16,
        A4: buffer17,
        C5: buffer18,
        "D#5": buffer19,
        "F#5": buffer20,
        A5: buffer21,
        C6: buffer22,
        "D#6": buffer23,
        "F#6": buffer24,
        A6: buffer25,
        C7: buffer26,
        "D#7": buffer27,
        "F#7": buffer28,
        A7: buffer29,
        C8: buffer30,
      },
    })
      .connect(reverb)
      .toDestination();

    const mainBasicSynth = new Tone.Synth({
      volume: mainVolume,
    })
      .connect(reverb)
      .toDestination();

    return {
      piano: mainPiano,
      amSynth: mainAmSynth,
      basicSynth: mainBasicSynth,
    };
  }, [mainVolume, reverb]);

  const backgroundSynths = useMemo(() => {
    const backAmSynth = new Tone.AMSynth({
      volume: backgroundVolume,
    })
      .connect(tremolo)
      .toDestination();

    const backPiano = new Tone.Sampler({
      volume: backgroundVolume,
      urls: {
        A0: buffer31,
        C1: buffer32,
        "D#1": buffer33,
        "F#1": buffer34,
        A1: buffer35,
        C2: buffer36,
        "D#2": buffer37,
        "F#2": buffer38,
        A2: buffer39,
        C3: buffer40,
        "D#3": buffer41,
        "F#3": buffer42,
        A3: buffer43,
        C4: buffer44,
        "D#4": buffer45,
        "F#4": buffer46,
        A4: buffer47,
        C5: buffer48,
        "D#5": buffer49,
        "F#5": buffer50,
        A5: buffer51,
        C6: buffer52,
        "D#6": buffer53,
        "F#6": buffer54,
        A6: buffer55,
        C7: buffer56,
        "D#7": buffer57,
        "F#7": buffer58,
        A7: buffer59,
        C8: buffer60,
      },
    })
      .connect(tremolo)
      .toDestination();

    const backBasicSynth = new Tone.Synth({
      volume: backgroundVolume,
    })
      .connect(tremolo)
      .toDestination();

    return {
      piano: backPiano,
      amSynth: backAmSynth,
      basicSynth: backBasicSynth,
    };
  }, [backgroundVolume, tremolo]);

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

  const handleTremoloFrequencyChange = (event, newValue) => {
    setTremoloFrequency(newValue);
  };

  const handleReverbDecayChange = (event, newValue) => {
    setReverbDecay(newValue);
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
                size="medium"
                orientation="vertical"
                exclusive
                onChange={handleMainInstrumentChoice}
                sx={{ width: "80px" }}
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
                  spacing={1.2}
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
                size="medium"
                orientation="vertical"
                exclusive
                onChange={handleBackInstrumentChoice}
                sx={{ width: "80px" }}
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
                  spacing={1.2}
                  direction="row"
                  sx={{ mb: 1, mt: 1 }}
                  alignItems="center"
                >
                  <VolumeDown />
                  <Slider
                    aria-label="backVolume"
                    min={-50}
                    max={10}
                    value={backgroundVolume}
                    onChange={handleBackVolumeChange}
                  />
                  <VolumeUp />
                </Stack>
              </Box>
              <Box sx={{ width: "120px" }}>
                <Stack
                  spacing={1.2}
                  direction="row"
                  sx={{ mb: 1, mt: 1 }}
                  alignItems="center"
                >
                  <WavesIcon sx={{ transform: "scale(0.8)" }} />
                  <Slider
                    aria-label="tremolo"
                    value={tremoloFrequency}
                    onChange={handleTremoloFrequencyChange}
                    step={2}
                    marks
                    min={0}
                    max={20}
                  />
                  <WavesIcon />
                </Stack>
              </Box>
              <Box sx={{ width: "120px" }}>
                <Stack
                  spacing={1.2}
                  direction="row"
                  sx={{ mb: 1, mt: 1 }}
                  alignItems="center"
                >
                  <SpatialAudioIcon sx={{ transform: "scale(0.8)" }} />
                  <Slider
                    aria-label="reverb"
                    value={reverbDecay}
                    onChange={handleReverbDecayChange}
                    step={2}
                    marks
                    min={1}
                    max={15}
                  />
                  <SpatialAudioIcon />
                </Stack>
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
