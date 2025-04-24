import { GUITAR_STRING_NOTES, noteToNoteId } from "@/types/note";
import { createSelector } from "@reduxjs/toolkit";
import { RootState } from "../store";

const selectNoteGuessrReducer = (state: RootState) => state.noteGuessr;

export const selectNoteGuessrSettings = createSelector(
  [selectNoteGuessrReducer],
  (noteGuessrReducer) => noteGuessrReducer.settings
);

export const selectNoteGuessrAverageTimeByNote = (noteId: string) =>
  createSelector([selectNoteGuessrReducer], (noteGuessrReducer) => {
    const averageTime = noteGuessrReducer.averageTime[noteId] || [Infinity];
    return (
      averageTime.reduce((acc, curr) => acc + curr, 0) / averageTime.length
    );
  });

export const selectNoteGuessrAverageTimeAllNotes = createSelector(
  [selectNoteGuessrReducer],
  (noteGuessrReducer) => {
    const allNotes = Object.values(GUITAR_STRING_NOTES).flat();

    return allNotes
      .map((note) => {
        const averageTime = noteGuessrReducer.averageTime[
          noteToNoteId(note)
        ] || [Infinity];
        return {
          noteId: noteToNoteId(note),
          averageTime:
            averageTime.reduce((acc, curr) => acc + curr, 0) /
            averageTime.length,
        };
      })
      .sort((a, b) => a.averageTime - b.averageTime);
  }
);
