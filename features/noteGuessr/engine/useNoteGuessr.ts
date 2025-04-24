import micInput from "@/features/noteGuessr/pda/micInput";
import { YIN } from "@/features/noteGuessr/pda/yin";
import { useAppDispatch, useAppSelector } from "@/flux/hooks";
import { noteGuessrAddAverageTime } from "@/flux/noteguessr/reducer";
import {
  selectNoteGuessrAverageTimeAllNotes,
  selectNoteGuessrSettings,
} from "@/flux/noteguessr/selector";
import {
  frequencyToNote,
  GUITAR_STRING_NOTES,
  GuitarString,
  Note,
  noteToNoteId,
  NoteWithOctaveAndString,
} from "@/types/note";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";

export type NoteGuessr = {
  playing: boolean;
  start: () => Promise<void>;
  stop: () => void;
  frequency: number | null;
  note: Note | null;
  noteToFind: NoteWithOctaveAndString | null;
  maintainedNote: Note | null;
  startTime: number | null;
};

export interface NoteGuessrConfig {
  onSuccess: (note: Note) => void;
}

const DEFAULT_CONFIG: NoteGuessrConfig = {
  onSuccess: () => {},
};

export default function useNoteGuessr(
  partialConfig: Partial<NoteGuessrConfig> = {}
): NoteGuessr {
  const config: NoteGuessrConfig = { ...DEFAULT_CONFIG, ...partialConfig };

  const settings = useAppSelector(selectNoteGuessrSettings);

  const [startTime, setStartTime] = useState<number | null>(null);
  const rafId = useRef<number | null>(null);
  const [playing, setPlaying] = useState(false);
  const [frequency, setFrequency] = useState<number | null>(null);
  const yinRef = useRef<ReturnType<typeof YIN> | null>(null);
  const [maintainedNote, setMaintainedNote] = useState<Note | null>(null);

  const [noteToFind, setNoteToFind] = useState<NoteWithOctaveAndString | null>(
    null
  );

  const [noteStartTime, setNoteStartTime] = useState<number>(0);
  const dispatch = useAppDispatch();

  const averageTimeAllNotes = useAppSelector(
    selectNoteGuessrAverageTimeAllNotes
  );

  const possibleNotes = useMemo(() => {
    const guitarStringsNotes: NoteWithOctaveAndString[] = Object.keys(
      GUITAR_STRING_NOTES
    )
      .filter((stringName: string) =>
        settings.allowedStrings.includes(stringName as GuitarString)
      )
      .reduce((acc, stringName) => {
        return [
          ...acc,
          ...GUITAR_STRING_NOTES[stringName as GuitarString].map((note) => ({
            ...note,
            string: stringName as GuitarString,
          })),
        ];
      }, [] as NoteWithOctaveAndString[]);

    return guitarStringsNotes
      .filter((note) =>
        settings.allowedSemitone.some(
          (allowedNote) =>
            allowedNote.name === note.name &&
            allowedNote.modifier === note.modifier
        )
      )
      .map((note) => ({
        ...note,
        avg: averageTimeAllNotes.find((n) => n.noteId === noteToNoteId(note))
          ?.averageTime as number,
      }));
  }, [averageTimeAllNotes, settings.allowedSemitone, settings.allowedStrings]);

  const newNoteToFind = useCallback(() => {
    const possibleNotesSortedByAverageTime = possibleNotes.sort((a, b) => {
      const averageTimeA = averageTimeAllNotes.find(
        (note) => note.noteId === noteToNoteId(a)
      )?.averageTime as number;
      const averageTimeB = averageTimeAllNotes.find(
        (note) => note.noteId === noteToNoteId(b)
      )?.averageTime as number;
      return averageTimeA - averageTimeB;
    });

    const infiniteItems = possibleNotesSortedByAverageTime.filter(
      (item) => !isFinite(item.avg)
    );

    let note;

    if (infiniteItems.length > 0) {
      note = infiniteItems[Math.floor(Math.random() * infiniteItems.length)];
    } else {
      const finiteItems = possibleNotesSortedByAverageTime.filter((item) =>
        isFinite(item.avg)
      );
      const totalWeight = finiteItems.reduce((sum, x) => sum + x.avg, 0);
      if (totalWeight === 0) {
        note = finiteItems[Math.floor(Math.random() * finiteItems.length)];
      } else {
        const r = Math.random() * totalWeight;
        let cum = 0;
        for (const n of finiteItems) {
          cum += n.avg;
          if (r < cum) {
            note = n;
            break;
          }
        }
        if (!note) note = finiteItems[finiteItems.length - 1];
      }
    }

    setNoteToFind(note);
    setNoteStartTime(Date.now());
  }, [possibleNotes, averageTimeAllNotes]);

  useEffect(() => {
    if (noteToFind && maintainedNote) {
      if (
        noteToNoteId({
          ...noteToFind,
          string: undefined,
        }) === noteToNoteId(maintainedNote)
      ) {
        const timeMs = Date.now() - noteStartTime;
        dispatch(
          noteGuessrAddAverageTime({
            note: noteToNoteId(noteToFind),
            averageTimeMs: Math.max(timeMs - settings.msToMaintainNote, 0),
          })
        );
        setMaintainedNote(null);
        config.onSuccess?.(noteToFind);
        newNoteToFind();
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    // eslint-disable-next-line react-hooks/exhaustive-deps
    noteToNoteId(noteToFind),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    noteToNoteId(maintainedNote),
    newNoteToFind,
    noteStartTime,
  ]);

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
  }, [noteToNoteId(note)]);
  useEffect(() => {
    if (!note) return;
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
    setMaintainedNote(null);
    timeoutRef.current = setTimeout(() => {
      setMaintainedNote(note);
    }, settings.msToMaintainNote);

    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [noteToNoteId(note), settings.msToMaintainNote]);

  return {
    playing,
    start,
    stop,
    frequency,
    note,
    noteToFind,
    maintainedNote,
    startTime,
  };
}
