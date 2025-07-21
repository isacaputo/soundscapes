import React from "react";
import PropTypes from "prop-types";
import Box from "@mui/material/Box";
import Stack from "@mui/material/Stack";
import Slider from "@mui/material/Slider";

export const EffectControl = ({
  value,
  onChange,
  onChangeCommitted,
  min = 0,
  max = 60,
  step = 2,
  color = "primary",
  icon: Icon,
  label,
}) => {
  return (
    <Box>
      <Stack
        spacing={1.7}
        direction="column"
        sx={{ mb: 2, mt: 5, ml: 2 }}
        alignItems="center"
      >
        <Icon />
        <Slider
          sx={{ width: "5px", height: "120px" }}
          orientation="vertical"
          aria-label={label}
          value={value}
          onChange={onChange}
          onChangeCommitted={onChangeCommitted}
          step={step}
          marks
          min={min}
          max={max}
          color={color}
        />
        <Icon sx={{ transform: "scale(0.8)" }} />
      </Stack>
    </Box>
  );
};

EffectControl.propTypes = {
  value: PropTypes.number.isRequired,
  onChange: PropTypes.func.isRequired,
  onChangeCommitted: PropTypes.func.isRequired,
  min: PropTypes.number,
  max: PropTypes.number,
  step: PropTypes.number,
  color: PropTypes.oneOf(["primary", "secondary"]),
  icon: PropTypes.elementType.isRequired,
  label: PropTypes.string.isRequired,
};
