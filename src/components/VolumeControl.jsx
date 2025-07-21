import React from "react";
import PropTypes from "prop-types";
import Stack from "@mui/material/Stack";
import Slider from "@mui/material/Slider";
import VolumeDown from "@mui/icons-material/VolumeDown";
import VolumeUp from "@mui/icons-material/VolumeUp";

export const VolumeControl = ({
  value,
  onChange,
  onChangeCommitted,
  min = -25,
  max = 0,
  color = "primary",
}) => {
  return (
    <Stack
      spacing={1.5}
      direction="column"
      sx={{ mb: 1, mt: 2 }}
      alignItems="center"
    >
      <VolumeUp />
      <Slider
        aria-label="volume"
        min={min}
        max={max}
        sx={{ width: "5px", height: "80px" }}
        orientation="vertical"
        value={value}
        onChange={onChange}
        onChangeCommitted={onChangeCommitted}
        color={color}
      />
      <VolumeDown />
    </Stack>
  );
};

VolumeControl.propTypes = {
  value: PropTypes.number.isRequired,
  onChange: PropTypes.func.isRequired,
  onChangeCommitted: PropTypes.func.isRequired,
  min: PropTypes.number,
  max: PropTypes.number,
  color: PropTypes.oneOf(["primary", "secondary"]),
};
