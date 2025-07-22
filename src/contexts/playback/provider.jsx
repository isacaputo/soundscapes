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
  const sequencesRef = useRef({ background: null, main: null });
  const pendingPlayRef = useRef(false);

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

  const startCountTempo = useCallback(() => {
    setCountTempo(0);
    clearInterval(intervalRef.current);
    intervalRef.current = setInterval(updateCountTempo, tempo * 1000);
  }, [updateCountTempo, tempo]);

  const stopCountTempo = useCallback(() => {
    setCountTempo(null);
    clearInterval(intervalRef.current);
  }, []);

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

      // If synths aren't ready yet, mark as pending
      if (!backgroundSynths || !mainSynths) {
        console.log("Synths not ready yet, marking as pending");
        pendingPlayRef.current = true;
        setPlay(true); // Set UI to show playing state
        return;
      }

      // Synths are ready, start immediately
      startPlayback();
    } else {
      // Stop playback
      pendingPlayRef.current = false;
      stopPlayback();
    }
  };

  // Create sequences function
  const createSequences = useCallback(() => {
    // Only create if synths are available
    if (!backgroundSynths || !mainSynths) return;

    // Clean up existing sequences
    if (sequencesRef.current.background) {
      sequencesRef.current.background.dispose();
    }
    if (sequencesRef.current.main) {
      sequencesRef.current.main.dispose();
    }

    // Create new sequences
    const bSequence = new Tone.Sequence(
      (time, note) => {
        if (note) {
          backgroundSynths[backgroundInstrument].triggerAttackRelease(
            note,
            tempo * notesPerCompass,
            time,
          );
        }
      },
      backgroundSequence,
      tempo,
    );

    const mSequence = new Tone.Sequence(
      (time, note) => {
        if (note) {
          mainSynths[mainInstrument].triggerAttackRelease(
            note,
            tempo * 2,
            time,
          );
        }
      },
      mainSequence,
      tempo,
    );

    // Store sequences
    sequencesRef.current.background = bSequence;
    sequencesRef.current.main = mSequence;

    // Start sequences at position 0
    bSequence.start(0);
    mSequence.start(0);
  }, [
    backgroundSynths,
    mainSynths,
    backgroundInstrument,
    mainInstrument,
    backgroundSequence,
    mainSequence,
    tempo,
  ]);

  // Start playback when synths are ready
  const startPlayback = useCallback(() => {
    console.log("Starting playback with available synths");

    // Create fresh sequences
    createSequences();

    // Reset transport position and start
    Tone.Transport.position = 0;
    Tone.Transport.start();
    startCountTempo();
    setPlay(true);
    pendingPlayRef.current = false;
  }, [createSequences, startCountTempo]);

  // Stop playback
  const stopPlayback = useCallback(() => {
    console.log("Stopping playback");

    Tone.Transport.stop();
    stopCountTempo();
    setPlay(false);

    // Clean up sequences
    if (sequencesRef.current.background) {
      sequencesRef.current.background.dispose();
      sequencesRef.current.background = null;
    }
    if (sequencesRef.current.main) {
      sequencesRef.current.main.dispose();
      sequencesRef.current.main = null;
    }
  }, [stopCountTempo]);

  // Auto-start when synths become available
  useEffect(() => {
    if (pendingPlayRef.current && backgroundSynths && mainSynths) {
      console.log("Synths are now available, starting pending playback");
      startPlayback();
    }
  }, [backgroundSynths, mainSynths, startPlayback]);

  // Live editing - only update sequences if already playing
  useEffect(() => {
    // Only update if we're currently playing and sequences exist
    if (play && sequencesRef.current.background && sequencesRef.current.main) {
      console.log("Updating sequences for live editing");
      createSequences();
    }
  }, [
    play,
    createSequences,
    backgroundSequence,
    mainSequence,
    backgroundInstrument,
    mainInstrument,
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
