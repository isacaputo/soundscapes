import React from "react";
import PropTypes from "prop-types";
import ToggleButton from "@mui/material/ToggleButton";
import ToggleButtonGroup from "@mui/material/ToggleButtonGroup";
import PianoIcon from "@mui/icons-material/Piano";
import RadioIcon from "@mui/icons-material/Radio";
import StraightenIcon from "@mui/icons-material/Straighten";

export const InstrumentSelector = ({
  value,
  onChange,
  color = "#5e17eb",
  orientation = "vertical",
  size = "small",
}) => {
  return (
    <ToggleButtonGroup
      defaultValue="piano"
      value={value}
      size={size}
      orientation={orientation}
      exclusive
      onChange={onChange}
      sx={{ width: "60px" }}
    >
      <ToggleButton
        value="piano"
        aria-label="piano"
        sx={orientation === "horizontal" ? {} : { maxHeight: "65px" }}
      >
        <PianoIcon sx={{ color }} />
      </ToggleButton>
      <ToggleButton
        value="amSynth"
        aria-label="am-synth"
        sx={orientation === "horizontal" ? {} : { maxHeight: "65px" }}
      >
        <RadioIcon sx={{ color }} />
      </ToggleButton>
      <ToggleButton
        value="basicSynth"
        aria-label="basic-synth"
        sx={orientation === "horizontal" ? {} : { maxHeight: "65px" }}
      >
        <StraightenIcon sx={{ color }} />
      </ToggleButton>
    </ToggleButtonGroup>
  );
};

InstrumentSelector.propTypes = {
  value: PropTypes.string.isRequired,
  onChange: PropTypes.func.isRequired,
  color: PropTypes.string,
  orientation: PropTypes.oneOf(["vertical", "horizontal"]),
  size: PropTypes.oneOf(["small", "medium", "large"]),
};
