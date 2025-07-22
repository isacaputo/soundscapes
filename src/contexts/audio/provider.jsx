import React, {
  useEffect,
  useRef,
  useState,
  useCallback,
  useMemo,
} from "react";
import PropTypes from "prop-types";
import * as Tone from "tone";
import { AudioContext } from "./context";
import {
  backgroundPianoUrls,
  mainPianoUrls,
  sequenceExample1,
  sequenceExample2,
} from "../../helpers/const";

export const AudioProvider = ({ children }) => {
  // Audio state
  const [audioInitialized, setAudioInitialized] = useState(false);

  // Background and main instruments
  const [backgroundInstrument, setBackgroundInstrument] = useState("piano");
  const [mainInstrument, setMainInstrument] = useState("piano");

  // Reverb effect states
  const [reverbDecay, setReverbDecay] = useState(1);
  const [reverbDecayCommitted, setReverbDecayCommitted] = useState(1);

  // Tremolo effect states
  const [tremoloFrequency, setTremoloFrequency] = useState(0);
  const [tremoloFrequencyCommitted, setTremoloFrequencyCommitted] = useState(0);

  // Volume control
  const [backgroundVolume, setBackgroundVolume] = useState(-10);
  const [backgroundVolumeCommitted, setBackgroundVolumeCommitted] =
    useState(-10);

  const [mainVolume, setMainVolume] = useState(-10);
  const [mainVolumeCommitted, setMainVolumeCommitted] = useState(-10);

  // Sequences
  const [backgroundSequence, setBackgroundSequence] = useState(
    sequenceExample1.backSequence,
  );
  const [mainSequence, setMainSequence] = useState(
    sequenceExample1.mainSequence,
  );

  // Tremolo effect
  const tremolo = useMemo(() => {
    if (!audioInitialized) return null;
    const tremoloEffect = new Tone.Tremolo({
      frequency: 1, // Default frequency
      depth: 0.3, // Reduced from 0.8 to make effect more subtle
    }).toDestination();

    // Start tremolo and set initial wet value
    tremoloEffect.start();
    tremoloEffect.wet.value = tremoloFrequencyCommitted > 0 ? 1 : 0;
    return tremoloEffect;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [audioInitialized]); // Remove tremoloFrequencyCommitted dependency

  // Update tremolo frequency when it changes
  useEffect(() => {
    if (tremolo) {
      if (tremoloFrequencyCommitted === 0) {
        // Turn off tremolo by setting wet to 0
        tremolo.wet.value = 0;
      } else {
        // Turn on tremolo and set frequency
        tremolo.wet.value = 1;
        tremolo.frequency.value = tremoloFrequencyCommitted;
      }
    }
  }, [tremolo, tremoloFrequencyCommitted]);

  // Reverb effect
  const reverb = useMemo(() => {
    if (!audioInitialized) return null;
    const reverbEffect = new Tone.Reverb({
      decay: reverbDecayCommitted, // step="1" min="0" max="10"
      wet: reverbDecayCommitted > 0 ? 1 : 0, // Turn off when decay is 0
    }).toDestination();
    return reverbEffect;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [audioInitialized]); // Remove reverbDecayCommitted dependency

  // Update reverb decay when it changes
  useEffect(() => {
    if (reverb) {
      if (reverbDecayCommitted === 0) {
        // Turn off reverb by setting wet to 0
        reverb.wet.value = 0;
      } else {
        // Turn on reverb and set decay
        reverb.wet.value = 1;
        reverb.decay = reverbDecayCommitted;
      }
    }
  }, [reverb, reverbDecayCommitted]);

  // Main Synths
  const mainSynths = useMemo(() => {
    if (!audioInitialized || !reverb || !tremolo) return null;

    const mainAmSynth = new Tone.FMSynth({
      volume: mainVolumeCommitted,
    });

    const mainPiano = new Tone.Sampler({
      volume: mainVolumeCommitted,
      urls: mainPianoUrls,
    });

    const mainBasicSynth = new Tone.Synth({
      volume: mainVolumeCommitted,
    });

    // Connect each synth to both effects in parallel, then to destination
    mainAmSynth.connect(reverb);
    mainAmSynth.connect(tremolo);

    mainPiano.connect(reverb);
    mainPiano.connect(tremolo);

    mainBasicSynth.connect(reverb);
    mainBasicSynth.connect(tremolo);

    return {
      piano: mainPiano,
      amSynth: mainAmSynth,
      basicSynth: mainBasicSynth,
    };
  }, [mainVolumeCommitted, reverb, tremolo, audioInitialized]);

  // Background Synths
  const backgroundSynths = useMemo(() => {
    if (!audioInitialized || !reverb || !tremolo) return null;

    const backAmSynth = new Tone.FMSynth({
      volume: backgroundVolumeCommitted,
    });

    const backPiano = new Tone.Sampler({
      volume: backgroundVolumeCommitted,
      urls: backgroundPianoUrls,
    });

    const backBasicSynth = new Tone.Synth({
      volume: backgroundVolumeCommitted,
    });

    // Connect each synth to both effects in parallel, then to destination
    backAmSynth.connect(reverb);
    backAmSynth.connect(tremolo);

    backPiano.connect(reverb);
    backPiano.connect(tremolo);

    backBasicSynth.connect(reverb);
    backBasicSynth.connect(tremolo);

    return {
      piano: backPiano,
      amSynth: backAmSynth,
      basicSynth: backBasicSynth,
    };
  }, [backgroundVolumeCommitted, tremolo, reverb, audioInitialized]);

  return (
    <AudioContext.Provider
      value={{
        // Audio initialization
        audioInitialized,
        setAudioInitialized,

        // Instrument selection
        mainInstrument,
        setMainInstrument,
        backgroundInstrument,
        setBackgroundInstrument,

        // Volume controls
        mainVolume,
        setMainVolume,
        mainVolumeCommitted,
        setMainVolumeCommitted,
        backgroundVolume,
        setBackgroundVolume,
        backgroundVolumeCommitted,
        setBackgroundVolumeCommitted,

        // Effect controls
        reverbDecay,
        setReverbDecay,
        reverbDecayCommitted,
        setReverbDecayCommitted,
        tremoloFrequency,
        setTremoloFrequency,
        tremoloFrequencyCommitted,
        setTremoloFrequencyCommitted,

        // Sequences
        backgroundSequence,
        setBackgroundSequence,
        mainSequence,
        setMainSequence,

        // Audio objects
        tremolo,
        reverb,
        mainSynths,
        backgroundSynths,
      }}
    >
      {children}
    </AudioContext.Provider>
  );
};

AudioProvider.propTypes = {
  children: PropTypes.node.isRequired,
};
