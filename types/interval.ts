import {
  NOTE_LETTERS,
  NOTE_NATURAL,
  NoteModifier,
  NoteWithOctave,
  SEMITONE_LIST,
} from "@/types/note";

export type Interval = {
  keys: string[];
  semitone: number;
};

export const INTERVALS_LIST: Interval[] = [
  { keys: ["P1"], semitone: 0 },
  { keys: ["m2", "A1", "d2"], semitone: 1 },
  { keys: ["M2", "d3"], semitone: 2 },
  { keys: ["m3", "A2"], semitone: 3 },
  { keys: ["M3", "d4"], semitone: 4 },
  { keys: ["P4", "A3"], semitone: 5 },
  { keys: ["A4", "d5", "TT"], semitone: 6 },
  { keys: ["P5", "A4", "d6"], semitone: 7 },
  { keys: ["m6", "A5"], semitone: 8 },
  { keys: ["M6"], semitone: 9 },
  { keys: ["m7", "A6"], semitone: 10 },
  { keys: ["M7", "d8"], semitone: 11 },
  { keys: ["P8", "A7"], semitone: 12 },
];

// Parse an interval key like "M2", "d5", "TT", etc
function parseInterval(key: string): {
  diatonicSteps: number;
  semitones: number;
} {
  const interval = INTERVALS_LIST.find((iv) => iv.keys.includes(key));
  if (!interval) throw new Error(`Unknown interval key ${key}`);
  // the number part of the key is the diatonic size, e.g. "2" in "M2"
  if (key === "TT") return { diatonicSteps: 4, semitones: 6 };
  const numMatch = key.match(/\d+/);
  const diatonic = numMatch ? parseInt(numMatch[0], 10) : 2;
  return { diatonicSteps: diatonic, semitones: interval.semitone };
}

export function applyIntervalToNote(
  root: NoteWithOctave,
  intervalKey: string
): {
  ascending: NoteWithOctave;
  descending: NoteWithOctave;
} {
  function modifierToOffset(mod: string): number {
    if (mod === "##") return 2;
    if (mod === "#") return 1;
    if (mod === "b") return -1;
    if (mod === "bb") return -2;
    return 0;
  }

  function transpose(
    root: NoteWithOctave,
    steps: number,
    semitones: number,
    direction: 1 | -1 = 1
  ): NoteWithOctave {
    if (steps === 1) return { ...root };

    const rootLetterIdx = NOTE_LETTERS.indexOf(root.name);
    const rawIdx = rootLetterIdx + direction * (steps - 1);
    const targetLetterIdx = ((rawIdx % 7) + 7) % 7;
    const wraps = Math.floor(rawIdx / 7);
    const newLetter = NOTE_LETTERS[targetLetterIdx];

    const rootNatBase = NOTE_NATURAL[root.name] + (root.octave + 1) * 12;
    const rootAccOffset = modifierToOffset(root.modifier);
    const rootTotal = rootNatBase + rootAccOffset;

    const semis = semitones * direction;
    const targetNat = NOTE_NATURAL[newLetter] + (root.octave + 1 + wraps) * 12;
    const naturalDist = targetNat - rootTotal;
    const delta = semis - naturalDist;
    let modifier = "";
    console.log(delta, newLetter, modifier);
    if (delta === 1) modifier = "#";
    else if (delta === 2) modifier = "##";
    else if (delta === -1) modifier = "b";
    else if (delta === -2) modifier = "bb";
    else if (delta !== 0) {
      // fallback enharmonique : on retombe sur la transpo par demi-tons
      const rootMidi =
        NOTE_NATURAL[root.name] +
        modifierToOffset(root.modifier) +
        (root.octave + 1) * 12;
      const targetMidi = rootMidi + direction * semitones;
      const semitoneIndex = ((targetMidi % 12) + 12) % 12;
      const octave = Math.floor(targetMidi / 12) - 1;
      const { name: enhName, modifier: enhMod } = SEMITONE_LIST[semitoneIndex];
      return {
        name: enhName as NoteWithOctave["name"],
        modifier: enhMod as NoteModifier,
        octave,
      };
    }

    return {
      name: newLetter,
      modifier: modifier as NoteModifier,
      octave: root.octave + wraps,
    };
  }

  const { diatonicSteps, semitones } = parseInterval(intervalKey);
  const ascending = transpose(root, diatonicSteps, semitones, +1);
  const descending = transpose(root, diatonicSteps, semitones, -1);

  return { ascending, descending };
}
