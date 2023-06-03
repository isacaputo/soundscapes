import { useState } from "react";
import { useEffect } from "react";
import * as Tone from "tone";
import "./App.css";
import { styled } from "@mui/material/styles";
import Grid from "@mui/material/Grid";
import Button from "@mui/material/Button";

const initialSeq = ["C3", "D3", "E4", "F4", "G4", "A4", "B4", "C5"];

function App() {
  const [sequence, setSequence] = useState([]);

  const notes = ["C", "D", "E", "F", "G", "A", "B"];
  // A = La, B = Si, C = Dó, D = Ré, E = Mi, F = Fa, G = Sol

  // C, D, E, F, G, A, B

  // 1. Dó | 2. Ré | 3. Mi | 4. Fa | 5. Sol | 6. Lá | 7. Si  ()

  const octaves = [3, 4, 5];

  // synth sound + sequencer
  useEffect(() => {
    const synth = new Tone.Synth().toDestination();
    console.log(synth);
    const seq = new Tone.Sequence((time, note) => {
      synth.triggerAttackRelease(note, 0.1, time);
    }, sequence).start(0);
    console.log(seq);
    Tone.Transport.start();
    // tone.transport timing/rhythm/sequencing

    // cleanup function
    return () => {
      seq.stop();
      synth.dispose();
    };
  }, [sequence]);

  const handleNewNote = (note) => {
    setSequence((state) => [...state, note]);
  };

  return (
    <div>
      <Grid container>
        {initialSeq.map((note, index) => (
          <Button
            key={index}
            variant="contained"
            size="large"
            onClick={() => handleNewNote(note)}
          >
            {note}
          </Button>
        ))}
      </Grid>
      <Grid container>
        {initialSeq.map((note, index) => (
          <Button
            key={index}
            variant="contained"
            size="large"
            onClick={() => addNewNote(note)}
          >
            {note}
          </Button>
        ))}
      </Grid>
      <Grid container>
        {initialSeq.map((note, index) => (
          <Button
            key={index}
            variant="contained"
            size="large"
            onClick={() => handleNewNote(note)}
          >
            {note}
          </Button>
        ))}
      </Grid>
      <Grid container>
        {initialSeq.map((note, index) => (
          <Button
            key={index}
            variant="contained"
            size="large"
            onClick={() => handleNewNote(note)}
          >
            {note}
          </Button>
        ))}
      </Grid>
      <br />
      <Button variant="contained" size="large">
        PLAY
      </Button>
    </div>
  );
}

export default App;
