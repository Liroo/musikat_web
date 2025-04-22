export type NoteName = "c" | "d" | "e" | "f" | "g" | "a" | "b";
export type NoteModifier = "b" | "#" | "";

export interface Note {
  name: NoteName;
  modifier: NoteModifier;
  octave?: number;
}

export interface NoteWithOctave extends Note {
  octave: number;
}

export const SEMITONE_LIST: Note[] = [
  { name: "c", modifier: "" },
  { name: "c", modifier: "#" },
  { name: "d", modifier: "" },
  { name: "d", modifier: "#" },
  { name: "e", modifier: "" },
  { name: "f", modifier: "" },
  { name: "f", modifier: "#" },
  { name: "g", modifier: "" },
  { name: "g", modifier: "#" },
  { name: "a", modifier: "" },
  { name: "a", modifier: "#" },
  { name: "b", modifier: "" },
];

export const noteToStr = (note: Note | null) =>
  note ? `${note.name}${note.octave}${note.modifier}` : "";

/**
 * Given a note+octave, returns its frequency in Hz (A4 = 440 Hz).
 */
export function noteToFrequency(note: NoteWithOctave): number {
  const semitoneIndex = SEMITONE_LIST.findIndex(
    (n) => n.name === note.name && n.modifier === note.modifier
  );
  if (semitoneIndex < 0) {
    throw new Error(`Invalid note: ${note.name}${note.modifier}`);
  }

  // C0 is MIDI 12 => midi = 12*(octave+1) + semitoneIndex
  const midi = 12 * (note.octave + 1) + semitoneIndex;
  return 440 * Math.pow(2, (midi - 69) / 12);
}

/**
 * Given a frequency in Hz, returns the nearest note name, modifier, and octave.
 */
export function frequencyToNote(freq: number): Note | null {
  if (freq <= 0) return null;

  // compute the (possibly fractional) MIDI number
  const midiFloat = 12 * Math.log2(freq / 440) + 69;
  const midi = Math.round(midiFloat);

  // semitone within octave = 0..11
  const semitoneIndex = ((midi % 12) + 12) % 12;
  // compute octave back: MIDI 0 = C–1, MIDI 12 = C0, etc.
  const octave = Math.floor(midi / 12) - 1;

  const { name, modifier } = SEMITONE_LIST[semitoneIndex];
  return { name, modifier, octave };
}

// Guitar notes
export const GUITAR_E_STRING_MIN: NoteWithOctave = {
  name: "e",
  modifier: "",
  octave: 2,
};
export const GUITAR_E_STRING_MAX: NoteWithOctave = {
  name: "d",
  modifier: "",
  octave: 3,
};

export const GUITAR_A_STRING_MIN: NoteWithOctave = {
  name: "a",
  modifier: "",
  octave: 2,
};
export const GUITAR_A_STRING_MAX: NoteWithOctave = {
  name: "g",
  modifier: "",
  octave: 3,
};

export const GUITAR_D_STRING_MIN: NoteWithOctave = {
  name: "d",
  modifier: "",
  octave: 3,
};
export const GUITAR_D_STRING_MAX: NoteWithOctave = {
  name: "c",
  modifier: "",
  octave: 4,
};

export const GUITAR_G_STRING_MIN: NoteWithOctave = {
  name: "g",
  modifier: "",
  octave: 3,
};
export const GUITAR_G_STRING_MAX: NoteWithOctave = {
  name: "f",
  modifier: "",
  octave: 4,
};

export const GUITAR_B_STRING_MIN: NoteWithOctave = {
  name: "b",
  modifier: "",
  octave: 3,
};
export const GUITAR_B_STRING_MAX: NoteWithOctave = {
  name: "a",
  modifier: "",
  octave: 4,
};
export const GUITAR_E_HIGH_STRING_MIN: NoteWithOctave = {
  name: "e",
  modifier: "",
  octave: 4,
};
export const GUITAR_E_HIGH_STRING_MAX: NoteWithOctave = {
  name: "d",
  modifier: "",
  octave: 5,
};

export const GUITAR_E_STRING_NOTES = guitarNoteRange(
  GUITAR_E_STRING_MIN,
  GUITAR_E_STRING_MAX
);
export const GUITAR_A_STRING_NOTES = guitarNoteRange(
  GUITAR_A_STRING_MIN,
  GUITAR_A_STRING_MAX
);
export const GUITAR_D_STRING_NOTES = guitarNoteRange(
  GUITAR_D_STRING_MIN,
  GUITAR_D_STRING_MAX
);
export const GUITAR_G_STRING_NOTES = guitarNoteRange(
  GUITAR_G_STRING_MIN,
  GUITAR_G_STRING_MAX
);
export const GUITAR_B_STRING_NOTES = guitarNoteRange(
  GUITAR_B_STRING_MIN,
  GUITAR_B_STRING_MAX
);
export const GUITAR_E_HIGH_STRING_NOTES = guitarNoteRange(
  GUITAR_E_HIGH_STRING_MIN,
  GUITAR_E_HIGH_STRING_MAX
);

export type GuitarString = "e" | "a" | "d" | "g" | "b" | "e_high";

export const GUITAR_STRING_NOTES: Record<GuitarString, NoteWithOctave[]> = {
  e: GUITAR_E_STRING_NOTES,
  a: GUITAR_A_STRING_NOTES,
  d: GUITAR_D_STRING_NOTES,
  g: GUITAR_G_STRING_NOTES,
  b: GUITAR_B_STRING_NOTES,
  e_high: GUITAR_E_HIGH_STRING_NOTES,
};

export function guitarNoteRange(
  minNote: NoteWithOctave,
  maxNote: NoteWithOctave
): NoteWithOctave[] {
  const notes: NoteWithOctave[] = [];
  for (let octave = minNote.octave; octave <= maxNote.octave; octave++) {
    const startNoteIndex = SEMITONE_LIST.findIndex(
      (n) => n.name === minNote.name && n.modifier === minNote.modifier
    );
    const endNoteIndex = SEMITONE_LIST.findIndex(
      (n) => n.name === maxNote.name && n.modifier === maxNote.modifier
    );

    for (
      let i = minNote.octave === octave ? startNoteIndex : 0;
      maxNote.octave === octave ? i <= endNoteIndex : i < SEMITONE_LIST.length;
      i++
    ) {
      notes.push({
        name: SEMITONE_LIST[i].name,
        modifier: SEMITONE_LIST[i].modifier,
        octave,
      });
    }
  }
  return notes;
}
