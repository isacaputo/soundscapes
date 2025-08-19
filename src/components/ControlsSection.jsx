import React from "react";
import { IconButton } from "@mui/material";
import PlayCircleIcon from "@mui/icons-material/PlayCircle";
import StopCircleIcon from "@mui/icons-material/StopCircle";
import RestartAltIcon from "@mui/icons-material/RestartAlt";
import { useAudio } from "../contexts/audio";
import { usePlayback } from "../contexts/playback";
import { compass, notesPerCompass } from "../helpers/const";

export const ControlsSection = () => {
  const {
    setMainSequence,
    setBackgroundSequence,
    setMainVolume,
    setMainVolumeCommitted,
    setBackgroundVolume,
    setBackgroundVolumeCommitted,
    setTremoloFrequency,
    setTremoloFrequencyCommitted,
    setReverbDecay,
    setReverbDecayCommitted,
  } = useAudio();

  const { play, handleTogglePlay } = usePlayback();

  const handleReset = () => {
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
    <div className="buttons-container">
      <div className="play-stop-container">
        <IconButton
          size="medium"
          onClick={handleTogglePlay}
          className="play-stop-icon"
          disableRipple
          sx={{
            "&:focus": {
              outline: "none",
            },
            "&:focus-visible": {
              outline: "none",
            },
          }}
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
          onClick={handleReset}
          className="reset-icon"
          disableRipple
          sx={{
            "&:focus": {
              outline: "none",
            },
            "&:focus-visible": {
              outline: "none",
            },
          }}
        >
          <RestartAltIcon />
        </IconButton>
      </div>
    </div>
  );
};
