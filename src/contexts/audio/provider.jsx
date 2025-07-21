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
    return new Tone.Tremolo({
      frequency: tremoloFrequencyCommitted, // step="2" min="0" max="15
      depth: 0.8,
    })
      .toDestination()
      .start();
  }, [tremoloFrequencyCommitted, audioInitialized]);

  // Reverb effect
  const reverb = useMemo(() => {
    if (!audioInitialized) return null;
    return new Tone.Reverb({
      decay: reverbDecayCommitted, // step="1" min="0" max="10"
      wet: 1,
    }).toDestination();
  }, [reverbDecayCommitted, audioInitialized]);

  // Main Synths
  const mainSynths = useMemo(() => {
    if (!audioInitialized || !reverb || !tremolo) return null;

    const mainAmSynth = new Tone.FMSynth({
      volume: mainVolumeCommitted,
    })
      .chain(reverb, tremolo)
      .toDestination();

    const mainPiano = new Tone.Sampler({
      volume: mainVolumeCommitted,
      urls: mainPianoUrls,
    })
      .connect(reverb, tremolo)
      .toDestination();

    const mainBasicSynth = new Tone.Synth({
      volume: mainVolumeCommitted,
    })
      .connect(reverb, tremolo)
      .toDestination();

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
    })
      .chain(reverb, tremolo)
      .toDestination();

    const backPiano = new Tone.Sampler({
      volume: backgroundVolumeCommitted,
      urls: backgroundPianoUrls,
    })
      .chain(reverb, tremolo)
      .toDestination();

    const backBasicSynth = new Tone.Synth({
      volume: backgroundVolumeCommitted,
    })
      .chain(reverb, tremolo)
      .toDestination();

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
