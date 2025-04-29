export type NoteName = "c" | "d" | "e" | "f" | "g" | "a" | "b";
export type NoteModifier = "" | "#" | "b" | "##" | "bb";

export interface Note {
  name: NoteName;
  modifier: NoteModifier;
  octave?: number;
}

export interface NoteWithOctave extends Note {
  octave: number;
}

export interface NoteWithOctaveAndString extends NoteWithOctave {
  string: GuitarString;
}

// Natural semitone of C-major between two letters
export const NOTE_NATURAL: Record<NoteWithOctave["name"], number> = {
  c: 0,
  d: 2,
  e: 4,
  f: 5,
  g: 7,
  a: 9,
  b: 11,
};
export const NOTE_LETTERS: NoteWithOctave["name"][] = [
  "c",
  "d",
  "e",
  "f",
  "g",
  "a",
  "b",
];

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

function noteToSemitone(note: NoteWithOctave): number {
  let offset = 0;
  if (note.modifier === "##") offset = 2;
  else if (note.modifier === "#") offset = 1;
  else if (note.modifier === "b") offset = -1;
  else if (note.modifier === "bb") offset = -2;

  return NOTE_NATURAL[note.name] + offset + (note.octave + 1) * 12;
}

export function areNotesEnharmonicallyEqual(
  n1: NoteWithOctave,
  n2: NoteWithOctave
): boolean {
  return noteToSemitone(n1) === noteToSemitone(n2);
}

export const noteToNoteId = (
  note:
    | (Partial<NoteWithOctaveAndString> & {
        name: string;
        modifier: string;
      })
    | null
) => {
  const array = [note?.name, note?.octave, note?.modifier, note?.string];
  return array.map((item) => item || "").join(":");
};

export const noteIdToNote = (noteId: string) => {
  const [name, octave, modifier, string] = noteId.split(":");
  return { name, modifier, octave, string };
};

// Given a note+octave, returns its frequency in Hz (A4 = 440 Hz).
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

// Given a frequency in Hz, returns the nearest note name, modifier, and octave.
export function frequencyToNote(freq: number): Note | null {
  if (freq <= 0) return null;

  const midiFloat = 12 * Math.log2(freq / 440) + 69;
  const midi = Math.round(midiFloat);

  const semitoneIndex = ((midi % 12) + 12) % 12;
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
  modifier: "#",
  octave: 3,
};

export const GUITAR_A_STRING_MIN: NoteWithOctave = {
  name: "a",
  modifier: "",
  octave: 2,
};
export const GUITAR_A_STRING_MAX: NoteWithOctave = {
  name: "g",
  modifier: "#",
  octave: 3,
};

export const GUITAR_D_STRING_MIN: NoteWithOctave = {
  name: "d",
  modifier: "",
  octave: 3,
};
export const GUITAR_D_STRING_MAX: NoteWithOctave = {
  name: "c",
  modifier: "#",
  octave: 4,
};

export const GUITAR_G_STRING_MIN: NoteWithOctave = {
  name: "g",
  modifier: "",
  octave: 3,
};
export const GUITAR_G_STRING_MAX: NoteWithOctave = {
  name: "f",
  modifier: "#",
  octave: 4,
};

export const GUITAR_B_STRING_MIN: NoteWithOctave = {
  name: "b",
  modifier: "",
  octave: 3,
};
export const GUITAR_B_STRING_MAX: NoteWithOctave = {
  name: "a",
  modifier: "#",
  octave: 4,
};
export const GUITAR_E_HIGH_STRING_MIN: NoteWithOctave = {
  name: "e",
  modifier: "",
  octave: 4,
};
export const GUITAR_E_HIGH_STRING_MAX: NoteWithOctave = {
  name: "d",
  modifier: "#",
  octave: 5,
};

export const GUITAR_E_STRING_NOTES = guitarNoteRange(
  GUITAR_E_STRING_MIN,
  GUITAR_E_STRING_MAX,
  "e"
);
export const GUITAR_A_STRING_NOTES = guitarNoteRange(
  GUITAR_A_STRING_MIN,
  GUITAR_A_STRING_MAX,
  "a"
);
export const GUITAR_D_STRING_NOTES = guitarNoteRange(
  GUITAR_D_STRING_MIN,
  GUITAR_D_STRING_MAX,
  "d"
);
export const GUITAR_G_STRING_NOTES = guitarNoteRange(
  GUITAR_G_STRING_MIN,
  GUITAR_G_STRING_MAX,
  "g"
);
export const GUITAR_B_STRING_NOTES = guitarNoteRange(
  GUITAR_B_STRING_MIN,
  GUITAR_B_STRING_MAX,
  "b"
);
export const GUITAR_E_HIGH_STRING_NOTES = guitarNoteRange(
  GUITAR_E_HIGH_STRING_MIN,
  GUITAR_E_HIGH_STRING_MAX,
  "e_high"
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
  maxNote: NoteWithOctave,
  stringName: GuitarString
): NoteWithOctaveAndString[] {
  const notes: NoteWithOctaveAndString[] = [];
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
        string: stringName,
      });
    }
  }
  return notes;
}
