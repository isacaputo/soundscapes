let osc;
let birdSample;

const initialSeq = ["C3", "D3", "E4", "F4", "G4", "A4", "B4", "C5"];
function App() {
  // const [count, setCount] = useState(0);
  // const [isOscOn, setIsOscOn] = useState(false);
  const [oscs, setOscs] = useState([]);
  const [synth, setSynth] = useState(new Tone.Synth().toDestination());
  const [input, setInput] = useState();
  const [sequence, setSequence] = useState([]);
  const [loop, setLoop] = useState(null);
  const [sample, setSample] = useState();

  const notes = ["C", "D", "E", "F", "G", "A", "B"];
  // A = La, B = Si, C = Dó, D = Ré, E = Mi, F = Fa, G = Sol

  // C, D, E, F, G, A, B

  // 1. Dó | 2. Ré | 3. Mi | 4. Fa | 5. Sol | 6. Lá | 7. Si  ()

  const octaves = [3, 4, 5];

  // oscillation sound source
  // still not finished! need to add the harmonic sync to 2 or 3 osc
  function addOsc() {
    setOscs((state) => [
      ...state,
      new Tone.Oscillator(input, "sine").toDestination(),
    ]);
  }

  function stopOsc(osc) {
    osc.stop();
  }

  // loop not working :(
  function loopA(time) {
    // the sequence
    for (let i = 0; i < sequence.length; i++) {
      const note = sequence[i];
      synth.triggerAttackRelease(note, "8n", time + i * Tone.Time("8n"));
    }
  }

  function playSynth() {
    if (loop) {
      loop.start();
    }
    const newLoop = new Tone.Loop(loopA, "6n").start(0);
    setLoop(newLoop);
    Tone.Transport.start();
  }

  function changeSequence(newSequence) {
    setSequence(newSequence);
  }

  // define random generated sequences
  function randomSeq() {
    const newSequence = [];

    for (let i = 0; i < 6; i++) {
      const randomNote = notes[Math.floor(Math.random() * notes.length)];
      const randomOctave = octaves[Math.floor(Math.random() * octaves.length)];
      newSequence.push(randomNote + randomOctave);
    }
    setSequence(newSequence);
  }

  // changes note in the current octave UP to octave 5
  function noteUp(index) {
    setSequence((prevSequence) => {
      const newSequence = [...prevSequence];
      const currentNote = newSequence[index];
      const currentNoteIndex = notes.indexOf(currentNote.charAt(0)); // A
      const currentOctave = parseInt(currentNote.charAt(1)); // 3
      const newNoteIndex = (currentNoteIndex + 1) % notes.length;
      const newOctave =
        currentOctave + Math.floor((currentNoteIndex + 1) / notes.length);
      const updatedOctave = octaves.includes(newOctave)
        ? newOctave
        : currentOctave;
      const newNote = notes[newNoteIndex] + updatedOctave;
      newSequence[index] = newNote;
      return newSequence;
    });
  }

  // changes note in the current octave DOWN to octave 3
  function noteDown(index) {
    setSequence((prevSequence) => {
      const newSequence = [...prevSequence];
      const currentNote = newSequence[index];
      const currentNoteIndex = notes.indexOf(currentNote.charAt(0));
      const currentOctave = parseInt(currentNote.charAt(1));
      const newNoteIndex = (currentNoteIndex - 1 + notes.length) % notes.length;
      const newOctave =
        currentOctave -
        Math.floor((currentNoteIndex - 1 + notes.length) / notes.length);
      const updatedOctave = octaves.includes(newOctave)
        ? newOctave
        : currentOctave;
      const newNote = notes[newNoteIndex] + updatedOctave;
      newSequence[index] = newNote;
      return newSequence;
    });
  }

  // sample not working :(
  function playSample() {
    const sampleIs =
      "/Users/isadorareig/Desktop/music-app-project/user/public/tanpura g sharp copia/01 Tanpura Gsharp.mp3";
    const player = new Tone.Player(sampleIs).toDestination();
    setSample(player);
    // sample.start();
  }

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

  // useEffect(() => {
  //   if (loop) {
  //     loop.dispose();
  //   }
  //   const newLoop = new Tone.Loop((time) => {
  //     for (let i = 0; i < sequence.length; i++) {
  //       const note = sequence[i];
  //       const synth = new Tone.Synth().toDestination();
  //       synth.triggerAttackRelease(note, "1n", time + i * Tone.Time("1n"));
  //     }
  //   }, Tone.Time("4n"));
  //   setLoop(newLoop);
  //   return () => {
  //     newLoop.dispose();
  //   };
  // }, [sequence]);

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
      {/*
      {sequence.map((note, index) => (
        <div key={index} className="note-container">
          <button>{note}</button>
          <button onClick={() => noteUp(index)}>▲</button>
          <button onClick={() => noteDown(index)}>▼</button>
        </div>
      ))}
      <div>
        {oscs.map((osc) => (
          <div key={osc}>
            <button onClick={() => osc.start()}>Play</button>
            <button onClick={() => stopOsc(osc)}>Stop</button>
          </div>
        ))}
      </div>
      <div>
        <button onClick={playSample}>Play Sample</button>
      </div>
      <div>
        <input value={input} onChange={(e) => setInput(e.target.value)} />
        <button onClick={addOsc}>add new osc</button>
        <button onClick={playSynth}>seq one</button>
        <button
          onClick={() => changeSequence(["D4", "F4", "A4", "C5", "G4", "B4"])}
        >
          seq two
        </button>
        <button onClick={randomSeq}>random seq</button>
      </div>
        */}
    </div>
  );
}

export default App;
