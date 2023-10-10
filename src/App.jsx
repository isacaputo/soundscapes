import React, {
  useRef,
  useState,
  useMemo,
  useEffect,
  useCallback,
} from "react";
import * as Tone from "tone";
import "./App.css";
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
import Radio from "@mui/material/Radio";
import RadioGroup from "@mui/material/RadioGroup";
import FormControlLabel from "@mui/material/FormControlLabel";
import FormControl from "@mui/material/FormControl";
import FormLabel from "@mui/material/FormLabel";
import RestartAltIcon from "@mui/icons-material/RestartAlt";
import { sequenceExample1, sequenceExample2 } from "./helper";
import * as Buffer from "./buffers";

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

// Number of compass and notes per compass
const notesPerCompass = 4;
const compass = 8;

export default function App() {
  const [backgroundInstrument, setBackgroundInstrument] = useState("piano");
  const [mainInstrument, setMainInstrument] = useState("piano");
  const [tempo, setTempo] = useState(0.5);
  const [play, setPlay] = useState(false);
  const [countTempo, setCountTempo] = useState(null);
  const intervalRef = useRef();

  const [reverbDecay, setReverbDecay] = useState(1);
  const [reverbDecayCommitted, setReverbDecayCommitted] = useState(1);

  const [tremoloFrequency, setTremoloFrequency] = useState(0);
  const [tremoloFrequencyCommitted, setTremoloFrequencyCommitted] = useState(0);

  const [backgroundVolume, setBackgroundVolume] = useState(-10);
  const [backgroundVolumeCommitted, setBackgroundVolumeCommitted] =
    useState(-10);

  const [mainVolume, setMainVolume] = useState(-10);
  const [mainVolumeCommitted, setMainVolumeCommitted] = useState(-10);

  const [numberOfBeats, setNumberOfBeats] = useState(120);
  const [numberOfBeatsCommitted, setNumberOfBeatsCommitted] = useState(120);

  const [backgroundSequence, setBackgroundSequence] = useState(
    sequenceExample1.backSequence,
  );
  const [mainSequence, setMainSequence] = useState(
    sequenceExample1.mainSequence,
  );

  // Effects
  const tremolo = useMemo(() => {
    return new Tone.Tremolo({
      frequency: tremoloFrequencyCommitted, // step="2" min="0" max="15
      depth: 0.8,
    })
      .toDestination()
      .start();
  }, [tremoloFrequencyCommitted]);

  const reverb = useMemo(() => {
    return new Tone.Reverb({
      decay: reverbDecayCommitted, // step="1" min="0" max="10"
      wet: 1,
    }).toDestination();
  }, [reverbDecayCommitted]);

  // Main Synths
  const mainSynths = useMemo(() => {
    const mainAmSynth = new Tone.FMSynth({
      volume: mainVolumeCommitted,
    })
      .chain(reverb, tremolo)
      .toDestination();

    const mainPiano = new Tone.Sampler({
      volume: mainVolumeCommitted,
      urls: {
        A0: Buffer.buffer1,
        C1: Buffer.buffer2,
        "D#1": Buffer.buffer3,
        "F#1": Buffer.buffer4,
        A1: Buffer.buffer5,
        C2: Buffer.buffer6,
        "D#2": Buffer.buffer7,
        "F#2": Buffer.buffer8,
        A2: Buffer.buffer9,
        C3: Buffer.buffer10,
        "D#3": Buffer.buffer11,
        "F#3": Buffer.buffer12,
        A3: Buffer.buffer13,
        C4: Buffer.buffer14,
        "D#4": Buffer.buffer15,
        "F#4": Buffer.buffer16,
        A4: Buffer.buffer17,
        C5: Buffer.buffer18,
        "D#5": Buffer.buffer19,
        "F#5": Buffer.buffer20,
        A5: Buffer.buffer21,
        C6: Buffer.buffer22,
        "D#6": Buffer.buffer23,
        "F#6": Buffer.buffer24,
        A6: Buffer.buffer25,
        C7: Buffer.buffer26,
        "D#7": Buffer.buffer27,
        "F#7": Buffer.buffer28,
        A7: Buffer.buffer29,
        C8: Buffer.buffer30,
      },
    })
      .connect(reverb, tremolo)
      .toDestination();

    const mainBasicSynth = new Tone.Synth({
      volume: mainVolumeCommitted,
    })
      .connect(reverb, tremolo)
      .toDestination();

    return {
      piano: mainPiano,
      amSynth: mainAmSynth,
      basicSynth: mainBasicSynth,
    };
  }, [mainVolumeCommitted, reverb, tremolo]);

  // Background Synths
  const backgroundSynths = useMemo(() => {
    const backAmSynth = new Tone.FMSynth({
      volume: backgroundVolumeCommitted,
    })
      .chain(reverb, tremolo)
      .toDestination();

    const backPiano = new Tone.Sampler({
      volume: backgroundVolumeCommitted,
      urls: {
        A0: Buffer.buffer31,
        C1: Buffer.buffer32,
        "D#1": Buffer.buffer33,
        "F#1": Buffer.buffer34,
        A1: Buffer.buffer35,
        C2: Buffer.buffer36,
        "D#2": Buffer.buffer37,
        "F#2": Buffer.buffer38,
        A2: Buffer.buffer39,
        C3: Buffer.buffer40,
        "D#3": Buffer.buffer41,
        "F#3": Buffer.buffer42,
        A3: Buffer.buffer43,
        C4: Buffer.buffer44,
        "D#4": Buffer.buffer45,
        "F#4": Buffer.buffer46,
        A4: Buffer.buffer47,
        C5: Buffer.buffer48,
        "D#5": Buffer.buffer49,
        "F#5": Buffer.buffer50,
        A5: Buffer.buffer51,
        C6: Buffer.buffer52,
        "D#6": Buffer.buffer53,
        "F#6": Buffer.buffer54,
        A6: Buffer.buffer55,
        C7: Buffer.buffer56,
        "D#7": Buffer.buffer57,
        "F#7": Buffer.buffer58,
        A7: Buffer.buffer59,
        C8: Buffer.buffer60,
      },
    })
      .chain(reverb, tremolo)
      .toDestination();

    const backBasicSynth = new Tone.Synth({
      volume: backgroundVolumeCommitted,
    })
      .chain(reverb, tremolo)
      .toDestination();

    return {
      piano: backPiano,
      amSynth: backAmSynth,
      basicSynth: backBasicSynth,
    };
  }, [backgroundVolumeCommitted, tremolo, reverb]);

  useEffect(() => {
    Tone.Transport.bpm.value = numberOfBeatsCommitted;
  }, [numberOfBeatsCommitted]);

  const getNext4ndIndex = (index) => {
    return index % 4 === 0;
  };

  const getNext8ndIndex = (index) => {
    return index % 8 === 0;
  };

  // Handling synth choice
  const handleMainInstrumentChoice = (event, synthChoice) => {
    setMainInstrument(synthChoice);
  };

  const handleBackInstrumentChoice = (event, synthChoice) => {
    setBackgroundInstrument(synthChoice);
  };

  const updateCountTempo = useCallback(
    (tempoForced) => {
      setCountTempo((previous) => {
        if (tempoForced) {
          return tempoForced === mainSequence.length - 1 ? 0 : tempoForced + 1;
        }
        return previous === mainSequence.length - 1 ? 0 : previous + 1;
      });
    },
    [mainSequence],
  );

  // Visual representation of time
  const startCountTempo = () => {
    setCountTempo(0);
    clearInterval(intervalRef.current);
    intervalRef.current = setInterval(updateCountTempo, tempo * 1000);
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

  // Use Effects
  useEffect(() => {
    const bSequence = new Tone.Sequence(
      (time, note) => {
        setPlay(true);
        backgroundSynths[backgroundInstrument].triggerAttackRelease(
          note,
          tempo * notesPerCompass,
          time,
        );
      },
      backgroundSequence,
      tempo,
    ).start(0);

    const mSequence = new Tone.Sequence(
      (time, note) => {
        setPlay(true);
        mainSynths[mainInstrument].triggerAttackRelease(note, tempo * 2, time);
      },
      mainSequence,
      tempo,
    ).start(0);

    return () => {
      bSequence.clear();
      mSequence.clear();
    };
  }, [
    backgroundSequence,
    mainSequence,
    backgroundInstrument,
    mainInstrument,
    mainSynths,
    backgroundSynths,
    tempo,
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
        now,
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
          {
            <div className={"text"}>
              <strong>{note}</strong>
            </div>
          }
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
          {
            <div className="text">
              <strong>{note}</strong>
            </div>
          }
        </div>
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

  const handlePreSelectedSequence = (event, newValue) => {
    if (newValue === "sequenceExample1") {
      setMainSequence(sequenceExample1.mainSequence);
      setBackgroundSequence(sequenceExample1.backSequence);
    }
    if (newValue === "sequenceExample2") {
      setMainSequence(sequenceExample2.mainSequence);
      setBackgroundSequence(sequenceExample2.backSequence);
    }
  };

  const handleResetSequences = () => {
    setMainSequence(
      Array.from({ length: compass * notesPerCompass }).fill(null),
    );
    setBackgroundSequence(Array.from({ length: compass * 4 }).fill(null));
    setMainVolume(-10);
    setMainVolumeCommitted(-10);
    setBackgroundVolume(-10);
    setBackgroundVolumeCommitted(-10);
    setTremoloFrequency(0);
    setTremoloFrequencyCommitted(0);
    setReverbDecay(1);
    setReverbDecayCommitted(1);
  };

  const handleBpmChange = (event, newValue = 0) => {
    const inSeconds = 60 / newValue;
    console.log("bpm change", inSeconds);
    setNumberOfBeats(newValue);
  };

  const handleChangeBpmCommited = (event, newValue = 0) => {
    const inSeconds = 60 / newValue;

    clearInterval(intervalRef.current);
    updateCountTempo(countTempo);
    intervalRef.current = setInterval(updateCountTempo, inSeconds * 1000);

    setNumberOfBeatsCommitted(newValue);
    setTempo(inSeconds);
  };

  return (
    <div className="board">
      <img src={`/images/soundscapes-logo.png`} className="logo-image" />
      <div className="select-established-sequence">
        <FormControl>
          <FormLabel id="demo-row-radio-buttons-group-label"></FormLabel>
          <RadioGroup
            size="small"
            row
            aria-labelledby="demo-row-radio-buttons-group-label"
            name="row-radio-buttons-group"
            onChange={handlePreSelectedSequence}
            defaultValue={"sequenceExample1"}
          >
            <FormControlLabel
              value="sequenceExample1"
              control={<Radio />}
              label="Sequence 01"
            />
            <FormControlLabel
              value="sequenceExample2"
              control={<Radio />}
              label="Sequence 02"
            />
          </RadioGroup>
        </FormControl>
      </div>
      <div className="main-sequence-container">
        <div className="synth-options">
          <ToggleButtonGroup
            defaultValue="piano"
            value={mainInstrument}
            size="small"
            orientation="vertical"
            exclusive
            onChange={handleMainInstrumentChoice}
            sx={{ width: "60px" }}
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
          <Stack
            spacing={1.5}
            direction="column"
            sx={{ mb: 1, mt: 2 }}
            alignItems="center"
          >
            <VolumeUp />
            <Slider
              aria-label="mainVolume"
              min={-25}
              max={0}
              sx={{ width: "5px", height: "80px" }}
              orientation="vertical"
              value={mainVolume}
              onChange={handleMainVolumeChange}
              onChangeCommitted={(e, value) => setMainVolumeCommitted(value)}
            />
            <VolumeDown />
          </Stack>
        </div>
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
          })}
        </div>
        <div className="main-sequence-slider">
          <Box>
            <Stack
              spacing={1.7}
              direction="column"
              sx={{ mb: 2, mt: 5, ml: 2 }}
              alignItems="center"
            >
              <WavesIcon />
              <Slider
                sx={{ width: "5px", height: "120px" }}
                orientation="vertical"
                aria-label="tremolo"
                value={tremoloFrequency}
                onChange={handleTremoloFrequencyChange}
                onChangeCommitted={(e, value) =>
                  setTremoloFrequencyCommitted(value)
                }
                step={2}
                marks
                min={0}
                max={60}
              />
              <WavesIcon sx={{ transform: "scale(0.8)" }} />
            </Stack>
          </Box>
        </div>
      </div>
      <div className="back-sequence-container">
        <div className="synth-options">
          <ToggleButtonGroup
            defaultValue="piano"
            value={backgroundInstrument}
            size="small"
            orientation="vertical"
            exclusive
            onChange={handleBackInstrumentChoice}
            sx={{ width: "60px" }}
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
          <Box sx={{ height: "60px" }}>
            <Stack
              spacing={1.5}
              direction="column"
              sx={{ mb: 1, mt: 2 }}
              alignItems="center"
            >
              <VolumeUp />
              <Slider
                sx={{ width: "5px", height: "80px" }}
                color="secondary"
                orientation="vertical"
                aria-label="backVolume"
                min={-25}
                max={5}
                value={backgroundVolume}
                onChange={handleBackVolumeChange}
                onChangeCommitted={(e, value) =>
                  setBackgroundVolumeCommitted(value)
                }
              />
              <VolumeDown />
            </Stack>
          </Box>
        </div>

        <div className="back-sequence">
          {backgroundSequence.map((note, index) => {
            if (getNext4ndIndex(index)) {
              return (
                <div className="back-compass" key={index}>
                  {renderNotesBackSequence(index)}
                </div>
              );
            }
            return null;
          })}
        </div>
        <Box>
          <Stack
            spacing={1.7}
            direction="column"
            sx={{ mb: 1, mt: 5, ml: 2 }}
            alignItems="center"
          >
            <SpatialAudioIcon />
            <Slider
              color="secondary"
              sx={{ width: "5px", height: "120px" }}
              orientation="vertical"
              aria-label="reverb"
              value={reverbDecay}
              onChange={handleReverbDecayChange}
              onChangeCommitted={(e, value) => setReverbDecayCommitted(value)}
              step={2}
              marks
              min={1}
              max={15}
            />
            <SpatialAudioIcon sx={{ transform: "scale(0.8)" }} />
          </Stack>
        </Box>
      </div>
      <div className="buttons-container">
        <div className="play-stop-container">
          <IconButton
            size="medium"
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
        <div className="reset-container">
          <IconButton
            size="medium"
            onClick={handleResetSequences}
            className="reset-icon"
          >
            <RestartAltIcon />
          </IconButton>
        </div>
      </div>
    </div>
  );
}
