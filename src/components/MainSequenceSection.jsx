import React from "react";
import WavesIcon from "@mui/icons-material/Waves";
import { InstrumentSelector } from "./InstrumentSelector";
import { VolumeControl } from "./VolumeControl";
import { EffectControl } from "./EffectControl";
import { SequenceGrid } from "./SequenceGrid";
import { useAudio } from "../contexts/audio";
import { usePlayback } from "../contexts/playback";
import { mainNotes, notesPerCompass } from "../helpers/const";

export const MainSequenceSection = () => {
  const {
    mainInstrument,
    setMainInstrument,
    mainVolume,
    setMainVolume,
    setMainVolumeCommitted,
    tremoloFrequency,
    setTremoloFrequency,
    setTremoloFrequencyCommitted,
    mainSequence,
  } = useAudio();

  const { countTempo } = usePlayback();

  const handleInstrumentChange = (event, synthChoice) => {
    setMainInstrument(synthChoice);
  };

  const handleVolumeChange = (event, newValue) => {
    setMainVolume(newValue);
  };

  const handleTremoloChange = (event, newValue) => {
    setTremoloFrequency(newValue);
  };
  return (
    <div className="main-sequence-container">
      <div className="synth-options">
        <InstrumentSelector
          value={mainInstrument}
          onChange={handleInstrumentChange}
          color="#5e17eb"
        />
        <VolumeControl
          value={mainVolume}
          onChange={handleVolumeChange}
          onChangeCommitted={(e, value) => setMainVolumeCommitted(value)}
          min={-25}
          max={0}
        />
      </div>

      <SequenceGrid
        sequence={mainSequence}
        notes={mainNotes}
        countTempo={countTempo}
        notesPerCompass={notesPerCompass}
        type="main"
      />

      <div className="main-sequence-slider">
        <EffectControl
          value={tremoloFrequency}
          onChange={handleTremoloChange}
          onChangeCommitted={(e, value) => setTremoloFrequencyCommitted(value)}
          min={0}
          max={60}
          step={2}
          icon={WavesIcon}
          label="tremolo"
        />
      </div>
    </div>
  );
};
