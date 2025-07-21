import React from "react";
import Radio from "@mui/material/Radio";
import RadioGroup from "@mui/material/RadioGroup";
import FormControlLabel from "@mui/material/FormControlLabel";
import FormControl from "@mui/material/FormControl";
import FormLabel from "@mui/material/FormLabel";
import { useAudio } from "../contexts/audio";
import { sequenceExample1, sequenceExample2 } from "../helpers/const";

export const Header = () => {
  const { setMainSequence, setBackgroundSequence } = useAudio();

  const handleSequenceChange = (event, newValue) => {
    if (newValue === "sequenceExample1") {
      setMainSequence(sequenceExample1.mainSequence);
      setBackgroundSequence(sequenceExample1.backSequence);
    }
    if (newValue === "sequenceExample2") {
      setMainSequence(sequenceExample2.mainSequence);
      setBackgroundSequence(sequenceExample2.backSequence);
    }
  };
  return (
    <div>
      <img src={`/images/soundscapes-logo.png`} className="logo-image" />
      <div className="select-established-sequence">
        <FormControl>
          <FormLabel id="demo-row-radio-buttons-group-label"></FormLabel>
          <RadioGroup
            size="small"
            row
            aria-labelledby="demo-row-radio-buttons-group-label"
            name="row-radio-buttons-group"
            onChange={handleSequenceChange}
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
    </div>
  );
};
