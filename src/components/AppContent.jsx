import React from "react";
import "./AppContent.css";
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
import * as Tone from "tone";

// Import context providers and hooks
import { useAudio } from "../contexts/audio";
import { usePlayback } from "../contexts/playback";
import {
  sequenceExample1,
  sequenceExample2,
  backgroundNotes,
  mainNotes,
  notesPerCompass,
  compass,
} from "../helpers/const";

export const AppContent = () => {
  const { play, handleTogglePlay, countTempo } = usePlayback();
  const {
    // Instruments
    mainInstrument,
    setMainInstrument,
    backgroundInstrument,
    setBackgroundInstrument,

    // Volumes
    mainVolume,
    setMainVolume,
    setMainVolumeCommitted,
    backgroundVolume,
    setBackgroundVolume,
    setBackgroundVolumeCommitted,

    // Effects
    reverbDecay,
    setReverbDecay,
    setReverbDecayCommitted,
    tremoloFrequency,
    setTremoloFrequency,
    setTremoloFrequencyCommitted,

    // Sequences
    backgroundSequence,
    setBackgroundSequence,
    mainSequence,
    setMainSequence,

    // Audio objects
    backgroundSynths,
    mainSynths,
    setAudioInitialized,
  } = useAudio();

  const getNext4ndIndex = (index) => {
    return index % 4 === 0;
  };

  // Handling synth choice
  const handleMainInstrumentChoice = (event, synthChoice) => {
    setMainInstrument(synthChoice);
  };

  const handleBackInstrumentChoice = (event, synthChoice) => {
    setBackgroundInstrument(synthChoice);
  };

  // Note handling functions
  const handleToggleNoteBackSeq = async (note, index, isBackNoteActive) => {
    if (!isBackNoteActive && !play) {
      // Start the audio context if it's suspended
      if (Tone.context.state === "suspended") {
        await Tone.start();
        setAudioInitialized(true);
      }
      // Only play if synths are available
      if (backgroundSynths) {
        const now = Tone.now();
        backgroundSynths[backgroundInstrument].triggerAttackRelease(
          note,
          "8n",
          now,
        );
      }
    }
    const copyBackgroundSequence = [...backgroundSequence];
    copyBackgroundSequence[index] =
      backgroundSequence[index] && backgroundSequence[index] === note
        ? null
        : note;
    setBackgroundSequence(copyBackgroundSequence);
  };

  const handleToggleNoteMainSeq = async (note, index, isMainNoteActive) => {
    if (!isMainNoteActive && !play) {
      // Start the audio context if it's suspended
      if (Tone.context.state === "suspended") {
        await Tone.start();
        setAudioInitialized(true);
      }
      // Only play if synths are available
      if (mainSynths) {
        const now = Tone.now();
        mainSynths[mainInstrument].triggerAttackRelease(note, "8n", now);
      }
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
};
