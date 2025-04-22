import micInput from "@/features/noteGuessr/pda/micInput";
import { YIN } from "@/features/noteGuessr/pda/yin";
import {
  frequencyToNote,
  GUITAR_STRING_NOTES,
  GuitarString,
  Note,
  noteToStr,
  NoteWithOctave,
} from "@/types/note";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";

export interface NoteGuessrConfig {
  msToMaintainNote: number;
  onSuccess: (note: Note) => void;
}

const DEFAULT_CONFIG: NoteGuessrConfig = {
  msToMaintainNote: 500,
  onSuccess: () => {},
};

export default function useNoteGuessr(config: Partial<NoteGuessrConfig> = {}) {
  config = { ...DEFAULT_CONFIG, ...config };

  const [startTime, setStartTime] = useState<number | null>(null);
  const rafId = useRef<number | null>(null);
  const [playing, setPlaying] = useState(false);
  const [frequency, setFrequency] = useState<number | null>(null);
  const yinRef = useRef<ReturnType<typeof YIN> | null>(null);
  const [maintainedNote, setMaintainedNote] = useState<Note | null>(null);

  const [stringToFind, setStringToFind] = useState<GuitarString | null>(null);
  const [noteToFind, setNoteToFind] = useState<Note | null>(null);

  const newNoteToFind = useCallback(() => {
    const guitarString: GuitarString = Object.keys(GUITAR_STRING_NOTES)[
      Math.floor(Math.random() * Object.keys(GUITAR_STRING_NOTES).length)
    ] as GuitarString;
    setStringToFind(guitarString as GuitarString);
    const notes: NoteWithOctave[] = GUITAR_STRING_NOTES[guitarString];
    const note = notes[Math.floor(Math.random() * notes.length)];
    setNoteToFind(note);
  }, []);

  useEffect(() => {
    if (noteToFind && maintainedNote) {
      if (noteToStr(noteToFind) === noteToStr(maintainedNote)) {
        config.onSuccess?.(noteToFind);
        newNoteToFind();
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [noteToStr(noteToFind), noteToStr(maintainedNote), newNoteToFind]);

  // loop engine to get the frequency
  const raf = useCallback(() => {
    if (yinRef.current) {
      const analyser = micInput.getAnalyser();
      if (!analyser) return;

      const frequencyData = new Float32Array(analyser?.fftSize ?? 0);

      analyser.getFloatTimeDomainData(frequencyData);

      const pitch = yinRef.current(frequencyData);
      if (pitch) setFrequency(Math.round(pitch));

      rafId.current = requestAnimationFrame(raf);
    }
  }, []);

  // start the note guessr
  const start = useCallback(async () => {
    if (micInput.getStream() === null) {
      await micInput.requestAudioInput();
      yinRef.current = YIN({
        sampleRate: micInput.getAudioContext()?.sampleRate ?? 44100,
      });

      rafId.current = requestAnimationFrame(raf);
      newNoteToFind();
      setStartTime(Date.now());
      setPlaying(true);
    }
  }, [raf, newNoteToFind]);

  // stop the note guessr
  const stop = useCallback(() => {
    setPlaying(false);
    if (rafId.current) {
      micInput.cleanup();
      cancelAnimationFrame(rafId.current);
      rafId.current = null;
    }
  }, []);

  // generate note and note name
  const note = useMemo(() => {
    if (!frequency) return null;
    return frequencyToNote(frequency);
  }, [frequency]);

  // in order to get a correct note, you have to play that note
  // for at least config.msToMaintainNote = 2 seconds
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);
  const noteRef = useRef<Note | null>(note);
  useEffect(() => {
    noteRef.current = note;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [noteToStr(note)]);
  useEffect(() => {
    if (!note) return;
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
    setMaintainedNote(null);
    timeoutRef.current = setTimeout(() => {
      setMaintainedNote(note);
    }, config.msToMaintainNote);

    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [noteToStr(note), config.msToMaintainNote]);

  return {
    playing,
    start,
    stop,
    frequency,
    note,
    stringToFind,
    noteToFind,
    maintainedNote,
    startTime,
  };
}
