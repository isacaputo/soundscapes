import React from "react";
import Box from "@mui/material/Box";
import SpatialAudioIcon from "@mui/icons-material/SpatialAudio";
import { InstrumentSelector } from "./InstrumentSelector";
import { VolumeControl } from "./VolumeControl";
import { EffectControl } from "./EffectControl";
import { SequenceGrid } from "./SequenceGrid";
import { useAudio } from "../contexts/audio";
import { backgroundNotes } from "../helpers/const";

export const BackgroundSequenceSection = () => {
  const {
    backgroundInstrument,
    setBackgroundInstrument,
    backgroundVolume,
    setBackgroundVolume,
    setBackgroundVolumeCommitted,
    reverbDecay,
    setReverbDecay,
    setReverbDecayCommitted,
  } = useAudio();

  const handleInstrumentChange = (event, synthChoice) => {
    setBackgroundInstrument(synthChoice);
  };

  const handleVolumeChange = (event, newValue) => {
    setBackgroundVolume(newValue);
  };

  const handleReverbChange = (event, newValue) => {
    setReverbDecay(newValue);
  };

  return (
    <div className="back-sequence-container">
      <div className="synth-options">
        <InstrumentSelector
          value={backgroundInstrument}
          onChange={handleInstrumentChange}
          color="#22C2F1"
        />
        <Box sx={{ height: "60px" }}>
          <VolumeControl
            value={backgroundVolume}
            onChange={handleVolumeChange}
            onChangeCommitted={(e, value) =>
              setBackgroundVolumeCommitted(value)
            }
            min={-25}
            max={5}
            color="secondary"
          />
        </Box>
      </div>

      <SequenceGrid notes={backgroundNotes} type="background" />

      <EffectControl
        value={reverbDecay}
        onChange={handleReverbChange}
        onChangeCommitted={(e, value) => setReverbDecayCommitted(value)}
        min={1}
        max={15}
        step={2}
        color="secondary"
        icon={SpatialAudioIcon}
        label="reverb"
      />
    </div>
  );
};
