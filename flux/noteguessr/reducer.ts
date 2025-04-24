import { createSlice, PayloadAction } from "@reduxjs/toolkit";

import { NoteGuessrSettings } from "@/flux/noteguessr/type";
import { GUITAR_STRING_NOTES, GuitarString, SEMITONE_LIST } from "@/types/note";
import { resetStore } from "../action";

export type NoteGuessrState = {
  settings: NoteGuessrSettings;
  averageTime: {
    [note: string]: number[];
  };
};

const initialState: NoteGuessrState = {
  settings: {
    msToMaintainNote: 400,
    allowedStrings: Object.keys(GUITAR_STRING_NOTES) as GuitarString[],
    allowedSemitone: SEMITONE_LIST,
  },
  averageTime: {},
};

const noteGuessrSlice = createSlice({
  name: "noteGuessr",
  initialState,
  reducers: {
    noteGuessrSetSettings: (
      state,
      action: PayloadAction<NoteGuessrSettings>
    ) => {
      state.settings = action.payload;
    },
    noteGuessrAddAverageTime: (
      state,
      action: PayloadAction<{ note: string; averageTimeMs: number }>
    ) => {
      // maximum 5 values, alway remove the oldest value
      state.averageTime[action.payload.note] = [
        ...(state.averageTime[action.payload.note] || []),
        action.payload.averageTimeMs,
      ].slice(-5);
    },
  },
  extraReducers: (builder) => {
    builder.addCase(resetStore, () => initialState);
  },
});

export const { noteGuessrSetSettings, noteGuessrAddAverageTime } =
  noteGuessrSlice.actions;

export default noteGuessrSlice;
