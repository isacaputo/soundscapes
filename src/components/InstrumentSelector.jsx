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
  color,
  orientation = "vertical",
  size = "small",
}) => {
  const handleChange = (event, newValue) => {
    if (newValue !== null) {
      onChange(event, newValue);
    }
  };

  return (
    <ToggleButtonGroup
      defaultValue="piano"
      value={value}
      size={size}
      orientation={orientation}
      exclusive
      onChange={handleChange}
      sx={{
        width: "60px",
        "& .MuiToggleButton-root": {
          border: `1px solid ${color}`,
          "&:focus": {
            outline: "none",
            border: "1px solid transparent",
          },
          "&.Mui-selected": {
            border: "1px solid transparent",
            "&:hover": {
              backgroundColor: color,
              border: "1px solid transparent",
            },
            "&:focus": {
              outline: "none",
              border: "1px solid transparent",
            },
          },
        },
      }}
    >
      <ToggleButton
        value="piano"
        aria-label="piano"
        sx={{
          ...(orientation === "horizontal" ? {} : { maxHeight: "65px" }),
          "&.Mui-selected": {
            backgroundColor: color,
          },
        }}
      >
        <PianoIcon sx={{ color: value === "piano" ? "white" : color }} />
      </ToggleButton>
      <ToggleButton
        value="amSynth"
        aria-label="am-synth"
        sx={{
          ...(orientation === "horizontal" ? {} : { maxHeight: "65px" }),
          "&.Mui-selected": {
            backgroundColor: color,
          },
        }}
      >
        <RadioIcon sx={{ color: value === "amSynth" ? "white" : color }} />
      </ToggleButton>
      <ToggleButton
        value="basicSynth"
        aria-label="basic-synth"
        sx={{
          ...(orientation === "horizontal" ? {} : { maxHeight: "65px" }),
          "&.Mui-selected": {
            backgroundColor: color,
          },
        }}
      >
        <StraightenIcon
          sx={{ color: value === "basicSynth" ? "white" : color }}
        />
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
