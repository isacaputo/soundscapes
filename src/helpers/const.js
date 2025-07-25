import * as Buffer from "./buffers";

// Existing Sequences
export const sequenceExample1 = {
  mainSequence: [
    "D4",
    "A3",
    "D4",
    "A3",

    "F4",
    "A3",
    "D4",
    "A3",

    "A3",
    "E4",
    "A3",
    "E4",

    "C4",
    "E4",
    "A3",
    "E4",

    "C4",
    "E4",
    "G4",
    "E4",

    "C4",
    "E4",
    "G4",
    "E4",

    "G4",
    "B3",
    "D4",
    "B3",

    "G4",
    "B3",
    "D4",
    "B3",
  ],
  backSequence: [
    "D2",
    null,
    null,
    null,
    "D2",
    null,
    null,
    null,
    "A2",
    null,
    null,
    null,
    "A2",
    null,
    null,
    null,
    "C2",
    null,
    null,
    null,
    "C2",
    null,
    null,
    null,
    "G2",
    null,
    null,
    null,
    "G2",
    null,
    null,
    null,
  ],
};

export const sequenceExample2 = {
  mainSequence: [
    "F4",
    "C4",
    "E4",
    "B3",

    "C4",
    "E4",
    "B3",
    "D4",

    "C4",
    "E4",
    "F4",
    "D4",

    "C4",
    "D4",
    "C4",
    "D4",

    "F4",
    "E4",
    "D4",
    "C4",

    "D4",
    "G4",
    "F4",
    "E4",

    "B3",
    "A3",
    "B3",
    "D4",

    "E4",
    "B3",
    "A3",
    "B3",
  ],
  backSequence: [
    "G2",
    null,
    null,
    null,

    "G2",
    null,
    null,
    null,

    "B2",
    null,
    null,
    null,

    "B2",
    null,
    null,
    null,

    "F2",
    null,
    null,
    null,

    "F2",
    null,
    null,
    null,

    "D2",
    null,
    null,
    null,

    "D2",
    null,
    null,
    null,
  ],
};

// Notes scale for background and main instruments
export const backgroundNotes = [
  "A2",
  "B2",
  "C2",
  "D2",
  "E2",
  "F2",
  "G2",
  "A3",
].reverse();

export const mainNotes = [
  "A3",
  "B3",
  "C4",
  "D4",
  "E4",
  "F4",
  "G4",
  "A4",
].reverse();

// Number of compass and notes per compass
export const notesPerCompass = 4;

export const compass = 8;

// Main piano urls
export const pianoUrls = {
  A0: Buffer.buffer1,
  C1: Buffer.buffer2,
  "D#1": Buffer.buffer3,
  "F#1": Buffer.buffer4,
  A1: Buffer.buffer5,
  C2: Buffer.buffer6,
  "D#2": Buffer.buffer7,
  "F#2": Buffer.buffer8,
  A2: Buffer.buffer9,
  C3: Buffer.buffer10,
  "D#3": Buffer.buffer11,
  "F#3": Buffer.buffer12,
  A3: Buffer.buffer13,
  C4: Buffer.buffer14,
  "D#4": Buffer.buffer15,
  "F#4": Buffer.buffer16,
  A4: Buffer.buffer17,
  C5: Buffer.buffer18,
  "D#5": Buffer.buffer19,
  "F#5": Buffer.buffer20,
  A5: Buffer.buffer21,
  C6: Buffer.buffer22,
  "D#6": Buffer.buffer23,
  "F#6": Buffer.buffer24,
  A6: Buffer.buffer25,
  C7: Buffer.buffer26,
  "D#7": Buffer.buffer27,
  "F#7": Buffer.buffer28,
  A7: Buffer.buffer29,
  C8: Buffer.buffer30,
};
