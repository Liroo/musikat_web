import { useAppSelector } from "@/flux/hooks";
import { selectIntervalFindrSettings } from "@/flux/intervalFindr/selector";
import { applyIntervalToNote } from "@/types/interval";
import {
  areNotesEnharmonicallyEqual,
  Note,
  NOTE_LETTERS,
  NoteWithOctave,
} from "@/types/note";
import { useState } from "react";

export type IntervalFindr = {
  playing: boolean;
  start: () => Promise<void>;
  stop: () => void;
  startTime: number | null;
  question: {
    rootNote: NoteWithOctave;
    interval: string;
    direction: 1 | -1;
  };
  generateQuestion: () => void;
  answerQuestion: (note: Note) => void;
  questionIndex: number;
};

export interface IntervalFindrConfig {
  onSuccess: () => void;
  onFailure: () => void;
}

const DEFAULT_CONFIG: IntervalFindrConfig = {
  onSuccess: () => {},
  onFailure: () => {},
};

export default function useIntervalFindr(
  partialConfig: Partial<IntervalFindrConfig> = {}
): IntervalFindr {
  const config: IntervalFindrConfig = { ...DEFAULT_CONFIG, ...partialConfig };

  const settings = useAppSelector(selectIntervalFindrSettings);

  const [startTime, setStartTime] = useState<number | null>(null);
  const [playing, setPlaying] = useState(false);

  const [rootNote, setRootNote] = useState<NoteWithOctave | null>(null);
  const [interval, setInterval] = useState<string | null>(null);
  const [direction, setDirection] = useState<1 | -1>(1);
  const [questionIndex, setQuestionIndex] = useState(0);

  const randomNote = () => {
    const noteLetter = NOTE_LETTERS[Math.floor(Math.random() * 7)];
    const modifier = ["", "#", "b"][Math.floor(Math.random() * 3)];

    const note = {
      name: noteLetter,
      modifier,
      octave: 4,
    };

    setRootNote(note as NoteWithOctave);
  };
  const randomInterval = () => {
    const interval =
      settings.allowedInterval[
        Math.floor(Math.random() * settings.allowedInterval.length)
      ];

    setInterval(interval);
  };
  const randomDirection = () => {
    if (settings.allowedInvertedInterval) {
      setDirection(Math.random() < 0.5 ? 1 : -1);
    } else {
      setDirection(1);
    }
  };

  const generateQuestion = () => {
    randomNote();
    randomInterval();
    randomDirection();
    setQuestionIndex(questionIndex + 1);
  };

  const answerQuestion = (note: Note) => {
    const { ascending, descending } = applyIntervalToNote(
      rootNote as NoteWithOctave,
      interval as string
    );

    let isCorrect = false;
    if (
      direction === 1 &&
      areNotesEnharmonicallyEqual(
        { ...ascending, octave: 4 },
        { ...note, octave: 4 }
      )
    )
      isCorrect = true;
    if (
      direction === -1 &&
      areNotesEnharmonicallyEqual(
        { ...descending, octave: 4 },
        { ...note, octave: 4 }
      )
    )
      isCorrect = true;

    if (isCorrect) config.onSuccess();
    else config.onFailure();
  };

  // start the note guessr
  const start = async () => {
    setStartTime(Date.now());
    generateQuestion();
    setPlaying(true);
    setQuestionIndex(0);
  };

  // stop the note guessr
  const stop = () => {
    setPlaying(false);
  };

  return {
    playing,
    start,
    stop,
    startTime,
    answerQuestion,
    question: {
      rootNote: rootNote as NoteWithOctave,
      interval: interval as string,
      direction,
    },
    generateQuestion,
    questionIndex,
  };
}
