import React from "react";
import PropTypes from "prop-types";
import * as Tone from "tone";
import { NoteButton } from "./NoteButton";
import { useAudio } from "../contexts/audio";
import { usePlayback } from "../contexts/playback";
import { pianoUrls } from "../helpers/const";

export const SequenceGrid = ({
  notes,
  countTempo,
  notesPerCompass,
  type = "main", // "main" or "background"
}) => {
  const {
    mainSequence,
    setMainSequence,
    backgroundSequence,
    setBackgroundSequence,
    mainSynths,
    backgroundSynths,
    mainInstrument,
    backgroundInstrument,
    audioInitialized,
    setAudioInitialized,
  } = useAudio();

  const { play } = usePlayback();

  const sequence = type === "main" ? mainSequence : backgroundSequence;
  const setSequence = type === "main" ? setMainSequence : setBackgroundSequence;

  const handleNoteToggle = async (note, index, isNoteActive) => {
    if (!isNoteActive && !play) {
      // Initialize audio if needed
      if (Tone.context.state === "suspended") {
        await Tone.start();
      }

      // Try to use existing synths first
      const synthsToUse = type === "main" ? mainSynths : backgroundSynths;
      const instrumentToUse =
        type === "main" ? mainInstrument : backgroundInstrument;

      if (synthsToUse && synthsToUse[instrumentToUse]) {
        // Use existing synths if available
        const now = Tone.now();
        synthsToUse[instrumentToUse].triggerAttackRelease(note, "8n", now);
      } else {
        // Create a piano sampler for immediate feedback
        const previewSynth = new Tone.Sampler({
          volume: -10,
          urls: pianoUrls,
        }).toDestination();

        const now = Tone.now();
        previewSynth.triggerAttackRelease(note, "8n", now);

        // Clean up and initialize for next time
        setTimeout(() => {
          previewSynth.dispose();
        }, 1000);

        if (!audioInitialized) {
          setAudioInitialized(true);
        }
      }
    }
    // Toggle the note in the sequence
    const copySequence = [...sequence];
    copySequence[index] =
      sequence[index] && sequence[index] === note ? null : note;
    setSequence(copySequence);
  };

  const getNext4ndIndex = (index) => {
    return index % 4 === 0;
  };

  const renderNotes = (indexCompass) =>
    notes.map((note, indexNote) => {
      const isNoteActive = sequence[indexCompass] === note;
      return (
        <NoteButton
          key={`${indexCompass}-${indexNote}`}
          note={note}
          isActive={isNoteActive}
          onClick={() => handleNoteToggle(note, indexCompass, isNoteActive)}
        />
      );
    });

  if (type === "background") {
    return (
      <div className="back-sequence">
        {sequence.map((note, index) => {
          if (getNext4ndIndex(index)) {
            return (
              <div className="back-compass" key={index}>
                {renderNotes(index)}
              </div>
            );
          }
          return null;
        })}
      </div>
    );
  }

  let countBlock = 0;

  return (
    <div className="main-sequence">
      {sequence.map((_, index) => {
        if (getNext4ndIndex(index)) {
          countBlock++;
          return (
            <div className="compass" key={index}>
              {sequence.map((_, subIndex) => {
                const fromB = countBlock * notesPerCompass - notesPerCompass;
                const toB = countBlock * notesPerCompass;
                if (subIndex >= fromB && subIndex < toB) {
                  const isHighlighted = countTempo === subIndex;
                  return (
                    <div
                      key={`${index}-${subIndex}`}
                      className={`notes ${isHighlighted ? "highlighted" : ""}`}
                    >
                      {renderNotes(subIndex)}
                    </div>
                  );
                }
                return null;
              })}
            </div>
          );
        }
        return null;
      })}
    </div>
  );
};

SequenceGrid.propTypes = {
  notes: PropTypes.arrayOf(PropTypes.string).isRequired,
  countTempo: PropTypes.number,
  notesPerCompass: PropTypes.number,
  type: PropTypes.oneOf(["main", "background"]),
};
