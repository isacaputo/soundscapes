import React, { useRef, useState, useCallback, useEffect } from "react";
import PropTypes from "prop-types";
import * as Tone from "tone";
import { PlaybackContext } from "./context";
import { useAudio } from "../audio";
import { notesPerCompass } from "../../helpers/const";

export const PlaybackProvider = ({ children }) => {
  // Get audio context
  const {
    setAudioInitialized,
    mainSequence,
    backgroundSequence,
    mainSynths,
    backgroundSynths,
    mainInstrument,
    backgroundInstrument,
  } = useAudio();

  // Tempo and timing
  const [tempo, setTempo] = useState(0.5);
  const [countTempo, setCountTempo] = useState(null);

  // Playback state
  const [play, setPlay] = useState(false);

  const intervalRef = useRef();

  // Visual tempo counter
  const updateCountTempo = useCallback(
    (tempoForced) => {
      setCountTempo((previous) => {
        if (tempoForced) {
          return tempoForced === mainSequence.length - 1 ? 0 : tempoForced + 1;
        }
        return previous === mainSequence.length - 1 ? 0 : previous + 1;
      });
    },
    [mainSequence],
  );

  const startCountTempo = () => {
    setCountTempo(0);
    clearInterval(intervalRef.current);
    intervalRef.current = setInterval(updateCountTempo, tempo * 1000);
  };

  const stopCountTempo = () => {
    setCountTempo(null);
    clearInterval(intervalRef.current);
  };

  // Cleanup interval
  useEffect(() => {
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, []);

  // Main playback control
  const handleTogglePlay = async () => {
    const nextPlayState = !play;
    if (nextPlayState) {
      // Start the audio context if it's suspended
      if (Tone.context.state === "suspended") {
        await Tone.start();
        setAudioInitialized(true);
      }
      Tone.Transport.start();
      startCountTempo();
    } else {
      Tone.Transport.stop();
      stopCountTempo();
    }
    setPlay(nextPlayState);
  };

  // Sequence management (this creates the Tone.Sequence objects)
  useEffect(() => {
    // Only create sequences if synths are available
    if (!backgroundSynths || !mainSynths) return;

    const bSequence = new Tone.Sequence(
      (time, note) => {
        setPlay(true);
        backgroundSynths[backgroundInstrument].triggerAttackRelease(
          note,
          tempo * notesPerCompass,
          time,
        );
      },
      backgroundSequence,
      tempo,
    ).start(0);

    const mSequence = new Tone.Sequence(
      (time, note) => {
        setPlay(true);
        mainSynths[mainInstrument].triggerAttackRelease(note, tempo * 2, time);
      },
      mainSequence,
      tempo,
    ).start(0);

    return () => {
      bSequence.clear();
      mSequence.clear();
    };
  }, [
    backgroundSequence,
    mainSequence,
    backgroundInstrument,
    mainInstrument,
    mainSynths,
    backgroundSynths,
    tempo,
  ]);

  return (
    <PlaybackContext.Provider
      value={{
        // Playback state
        play,
        setPlay,

        // Timing
        tempo,
        setTempo,
        countTempo,
        setCountTempo,

        // Controls
        handleTogglePlay,

        // Visual timing
        startCountTempo,
        stopCountTempo,
        updateCountTempo,
        intervalRef,
      }}
    >
      {children}
    </PlaybackContext.Provider>
  );
};

PlaybackProvider.propTypes = {
  children: PropTypes.node.isRequired,
};
